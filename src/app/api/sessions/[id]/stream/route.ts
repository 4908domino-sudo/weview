// Design Ref: §4.2 GET /api/sessions/{id}/stream — SSE 실시간 스트림
// 3초 폴링으로 새 제출 감지 → 클라이언트에 push

import { NextRequest } from 'next/server';
import { getSession, aggregateSession } from '@/lib/session';

const POLL_INTERVAL_MS = 3000;
const KEEPALIVE_COMMENT = ': keepalive\n\n';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const initial = await getSession(id);
  if (!initial) {
    return new Response(
      JSON.stringify({ error: 'SESSION_NOT_FOUND' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const encoder = new TextEncoder();
  let lastCount = initial.submissions.length;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // 초기 데이터 전송
      send('update', aggregateSession(initial));

      const timer = setInterval(async () => {
        try {
          const session = await getSession(id);

          if (!session) {
            send('expired', {});
            clearInterval(timer);
            controller.close();
            return;
          }

          if (session.submissions.length !== lastCount) {
            lastCount = session.submissions.length;
            send('update', aggregateSession(session));
          } else {
            // SSE keepalive (프록시 타임아웃 방지)
            controller.enqueue(encoder.encode(KEEPALIVE_COMMENT));
          }
        } catch {
          clearInterval(timer);
          controller.close();
        }
      }, POLL_INTERVAL_MS);

      req.signal.addEventListener('abort', () => {
        clearInterval(timer);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',  // Nginx 버퍼링 비활성화
    },
  });
}
