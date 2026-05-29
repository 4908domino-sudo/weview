export interface StoredCriterion {
  key: string;
  label: string;
  desc: string;
  icon: string;
  superlativeTitle: string;
  superlativeEmoji: string;
}

export interface ActivitySettings {
  commentsEnabled: boolean;
  anonymous: boolean;
}

export interface StudentProfile {
  name: string;
}

const CRITERIA_KEY = 'weview_criteria';
const SETTINGS_KEY = 'weview_settings';
const PROFILE_KEY  = 'weview_student_profile';

export const DEFAULT_CRITERIA: StoredCriterion[] = [
  { key: 'content',  label: '발표 내용',   desc: '내용이 알차고 이해하기 쉬웠나요?',   icon: 'document',   superlativeTitle: '탐구왕',     superlativeEmoji: '🔎' },
  { key: 'voice',    label: '목소리·전달', desc: '또렷하게 잘 들렸나요?',             icon: 'microphone', superlativeTitle: '발표왕',     superlativeEmoji: '📣' },
  { key: 'teamwork', label: '협동',        desc: '친구들과 잘 협동했나요?',           icon: 'persons',    superlativeTitle: '협동왕',     superlativeEmoji: '🤝' },
  { key: 'creative', label: '창의성',      desc: '새롭고 재미있는 아이디어였나요?',   icon: 'sparkle',    superlativeTitle: '아이디어왕', superlativeEmoji: '✨' },
];

export const DEFAULT_SETTINGS: ActivitySettings = {
  commentsEnabled: true,
  anonymous: true,
};

// ── Criteria ──────────────────────────────────────────────────────
export function saveCriteria(criteria: StoredCriterion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CRITERIA_KEY, JSON.stringify(criteria));
}

export function loadCriteria(): StoredCriterion[] {
  if (typeof window === 'undefined') return DEFAULT_CRITERIA;
  try {
    const raw = localStorage.getItem(CRITERIA_KEY);
    if (!raw) return DEFAULT_CRITERIA;
    const parsed = JSON.parse(raw) as StoredCriterion[];
    return parsed.length > 0 ? parsed : DEFAULT_CRITERIA;
  } catch {
    return DEFAULT_CRITERIA;
  }
}

// ── Activity settings ─────────────────────────────────────────────
export function saveActivitySettings(settings: ActivitySettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadActivitySettings(): ActivitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ── Student profile ───────────────────────────────────────────────
export function saveStudentProfile(profile: StudentProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadStudentProfile(): StudentProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Mock scores ───────────────────────────────────────────────────
export function mockScoreForCriterion(groupId: string, criterionKey: string): number {
  const knownScores: Record<string, Record<string, number>> = {
    g1: { content: 4.6, voice: 4.2, teamwork: 4.8, creative: 4.5 },
    g2: { content: 4.8, voice: 4.7, teamwork: 4.4, creative: 4.9 },
    g3: { content: 4.3, voice: 4.5, teamwork: 4.9, creative: 4.2 },
    g4: { content: 4.5, voice: 4.0, teamwork: 4.6, creative: 4.7 },
    g5: { content: 4.7, voice: 4.6, teamwork: 4.3, creative: 4.4 },
  };
  if (knownScores[groupId]?.[criterionKey] !== undefined) {
    return knownScores[groupId][criterionKey];
  }
  const hash = (groupId + criterionKey).split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0);
  return 4.0 + (Math.abs(hash) % 11) / 10;
}
