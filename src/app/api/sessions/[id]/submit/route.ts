// Design Ref: §4.2 POST /api/sessions/{id}/submit — 학생 평가 제출
// Plan SC: 학생 QR 스캔 후 1분 내 제출

import { NextRequest, NextResponse } from 'next/server';
import { addSubmission } from '@/lib/session';
import type { SubmitRequest } from '@/types/session';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let body: Partial<SubmitRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: 'INVALID_JSON' } }, { status: 400 });
  }

  const { studentName = '', fromGroupId, toGroupId, scores, comment = '' } = body;

  if (!fromGroupId || !toGroupId) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'fromGroupId, toGroupId 필수' } },
      { status: 400 }
    );
  }
  if (!scores || typeof scores !== 'object') {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'scores 필수' } },
      { status: 400 }
    );
  }

  const result = await addSubmission(id, {
    studentName: String(studentName),
    fromGroupId: String(fromGroupId),
    toGroupId: String(toGroupId),
    scores,
    comment: String(comment),
  });

  if (!result.ok) {
    const status = result.error === 'SESSION_NOT_FOUND' ? 404 : 400;
    return NextResponse.json(
      { error: { code: result.error } },
      { status }
    );
  }

  return NextResponse.json({ ok: true, submissionId: result.submissionId });
}
