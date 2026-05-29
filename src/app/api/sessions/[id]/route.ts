// Design Ref: §4.2 GET /api/sessions/{id} — 세션 조회 + 집계

import { NextRequest, NextResponse } from 'next/server';
import { getSession, aggregateSession } from '@/lib/session';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getSession(id);

  if (!session) {
    return NextResponse.json(
      { error: { code: 'SESSION_NOT_FOUND', message: '세션이 없거나 만료됐어요.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ session: aggregateSession(session) });
}
