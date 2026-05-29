// Design Ref: §9.1 Infrastructure 레이어 — KV 추상화
// 로컬 개발: in-memory Map (프로세스 유지 동안 지속)
// 프로덕션: KV_REST_API_URL + KV_REST_API_TOKEN 환경변수 설정 시 Vercel KV 사용

interface KvEntry {
  value: unknown;
  expiresAt?: number;  // Unix ms
}

// 모듈 레벨 싱글톤 — Next.js dev 서버에서 요청 간 데이터 유지
const store = new Map<string, KvEntry>();

function isExpired(entry: KvEntry): boolean {
  return entry.expiresAt != null && Date.now() > entry.expiresAt;
}

function cleanup(): void {
  for (const [key, entry] of store.entries()) {
    if (isExpired(entry)) store.delete(key);
  }
}

// 주기적 정리 (메모리 누수 방지)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 60_000);
}

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    const entry = store.get(key);
    if (!entry) return null;
    if (isExpired(entry)) { store.delete(key); return null; }
    return entry.value as T;
  },

  async set(key: string, value: unknown, options?: { ex?: number }): Promise<void> {
    store.set(key, {
      value,
      expiresAt: options?.ex ? Date.now() + options.ex * 1000 : undefined,
    });
  },

  async del(key: string): Promise<void> {
    store.delete(key);
  },

  // 디버그용 — 현재 저장된 키 목록
  keys(): string[] {
    return Array.from(store.keys()).filter(k => {
      const entry = store.get(k)!;
      return !isExpired(entry);
    });
  },
};
