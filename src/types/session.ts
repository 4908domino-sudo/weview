// Design Ref: §3.1 — Session 데이터 모델 (KV 저장 단위)

export interface StoredCriterionRef {
  key: string;
  label: string;
  desc: string;
  icon: string;
  superlativeTitle: string;
  superlativeEmoji: string;
}

export interface SessionGroup {
  id: string;
  name: string;
  emoji: string;
  colorKey: string;
  members: string[];
}

export interface ActivitySettings {
  commentsEnabled: boolean;
  anonymous: boolean;
}

export interface Submission {
  id: string;
  studentName: string;    // '' when anonymous
  fromGroupId: string;    // 평가자 모둠
  toGroupId: string;      // 피평가 모둠
  scores: Record<string, number>;  // { criterionKey: 1-5 }
  comment: string;
  submittedAt: string;    // ISO 8601
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  expiresAt: string;      // createdAt + 24h
  criteria: StoredCriterionRef[];
  settings: ActivitySettings;
  groups: SessionGroup[];
  submissions: Submission[];
}

// Design Ref: §3.2 — 집계 결과 (GET /api/sessions/{id} 응답)
export interface AggregatedGroup {
  scores: Record<string, number[]>;   // 각 criterion별 제출된 점수 배열
  comments: string[];
  submissionCount: number;
}

export interface SessionWithAggregation extends Omit<Session, 'submissions'> {
  submissionCount: number;
  totalStudents: number;
  aggregated: Record<string, AggregatedGroup>;
}

// API 요청/응답 타입
export interface CreateSessionRequest {
  title: string;
  criteria: StoredCriterionRef[];
  settings: ActivitySettings;
  groups: SessionGroup[];
}

export interface CreateSessionResponse {
  sessionId: string;
  joinUrl: string;
  expiresAt: string;
}

export interface SubmitRequest {
  studentName: string;
  fromGroupId: string;
  toGroupId: string;
  scores: Record<string, number>;
  comment: string;
}
