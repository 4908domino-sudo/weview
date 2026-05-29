// Design Ref: §4.2 POST /api/sessions — 새 활동 세션 생성
// Plan SC: 선생님 3분 내 활동 생성

import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import type { CreateSessionRequest } from '@/types/session';

export async function POST(req: NextRequest) {
  let body: Partial<CreateSessionRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: 'INVALID_JSON' } }, { status: 400 });
  }

  const { title, criteria, settings, groups } = body;

  if (!title?.trim()) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: '활동 이름은 필수입니다.' } },
      { status: 400 }
    );
  }
  if (!Array.isArray(criteria) || criteria.length < 1 || criteria.length > 8) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: '평가 기준은 1~8개여야 합니다.' } },
      { status: 400 }
    );
  }
  if (!Array.isArray(groups) || groups.length < 2 || groups.length > 10) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: '모둠은 2~10개여야 합니다.' } },
      { status: 400 }
    );
  }

  try {
    const session = await createSession({
      title: title.trim(),
      criteria,
      settings: settings ?? { commentsEnabled: true, anonymous: true },
      groups,
    });

    const baseUrl = req.nextUrl.origin;
    return NextResponse.json(
      {
        sessionId: session.id,
        joinUrl: `${baseUrl}/join/${session.id}`,
        expiresAt: session.expiresAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/sessions]', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR' } }, { status: 500 });
  }
}
