export const ACTIVITY = {
  title: '우리 동네 환경 지키기',
  subject: '4학년 2반 · 사회',
  date: '2026. 5. 29.',
  code: 'WV-3842',
  criteria: [
    { key: 'content',  label: '발표 내용',   icon: 'document',   desc: '내용이 알차고 이해하기 쉬웠나요?' },
    { key: 'voice',    label: '목소리·전달', icon: 'microphone', desc: '또렷하게 잘 들렸나요?' },
    { key: 'teamwork', label: '협동',        icon: 'persons',    desc: '친구들과 잘 협동했나요?' },
    { key: 'creative', label: '창의성',      icon: 'sparkle',    desc: '새롭고 재미있는 아이디어였나요?' },
  ],
};

export const GROUP_COLORS = [
  { key: 'blue',   solid: 'var(--color-blue-50)',   deep: 'var(--color-blue-40)',   soft: 'var(--color-blue-95)',   tint: 'var(--color-blue-99)' },
  { key: 'violet', solid: 'var(--color-violet-50)', deep: 'var(--color-violet-40)', soft: 'var(--color-violet-95)', tint: 'var(--color-violet-99)' },
  { key: 'green',  solid: 'var(--color-green-50)',  deep: 'var(--color-green-30)',  soft: 'var(--color-green-95)',  tint: 'var(--color-green-99)' },
  { key: 'orange', solid: 'var(--color-orange-50)', deep: 'var(--color-orange-30)', soft: 'var(--color-orange-95)', tint: 'var(--color-orange-99)' },
  { key: 'pink',   solid: 'var(--color-pink-50)',   deep: 'var(--color-pink-30)',   soft: 'var(--color-pink-95)',   tint: 'var(--color-pink-99)' },
  { key: 'cyan',   solid: 'var(--color-cyan-50)',   deep: 'var(--color-cyan-30)',   soft: 'var(--color-cyan-95)',   tint: 'var(--color-cyan-99)' },
] as const;

export type GroupColorKey = typeof GROUP_COLORS[number]['key'];

export const GROUPS = [
  { id: 'g1', name: '햇살팀',   colorKey: 'orange' as GroupColorKey, emoji: '🌻', members: ['김서연', '이준호', '박지우', '최민서'], scores: { content: 4.6, voice: 4.2, teamwork: 4.8, creative: 4.5 }, votes: 22 },
  { id: 'g2', name: '바다팀',   colorKey: 'blue'   as GroupColorKey, emoji: '🌊', members: ['정하윤', '강도윤', '윤서아'],          scores: { content: 4.8, voice: 4.7, teamwork: 4.4, creative: 4.9 }, votes: 22 },
  { id: 'g3', name: '숲속팀',   colorKey: 'green'  as GroupColorKey, emoji: '🌳', members: ['임예준', '한지민', '오시우', '신아인'], scores: { content: 4.3, voice: 4.5, teamwork: 4.9, creative: 4.2 }, votes: 22 },
  { id: 'g4', name: '별빛팀',   colorKey: 'violet' as GroupColorKey, emoji: '⭐', members: ['배수호', '문채원', '조은우'],          scores: { content: 4.5, voice: 4.0, teamwork: 4.6, creative: 4.7 }, votes: 22 },
  { id: 'g5', name: '꽃잎팀',   colorKey: 'pink'   as GroupColorKey, emoji: '🌸', members: ['남도현', '서유나', '권시윤', '홍라온'], scores: { content: 4.7, voice: 4.6, teamwork: 4.3, creative: 4.4 }, votes: 22 },
];

export const COMMENTS = [
  { id: 1, group: 'g2', from: '햇살팀 친구', text: '바다 쓰레기 사진이 진짜 충격적이었어! 우리도 분리수거 더 잘하자고 다짐했어 🌊', stars: 5, likes: 7, tag: '발표 내용' },
  { id: 2, group: 'g1', from: '숲속팀 친구', text: '역할극으로 보여줘서 이해가 쏙쏙 됐어요. 목소리도 크고 또렷했어요!', stars: 5, likes: 5, tag: '목소리·전달' },
  { id: 3, group: 'g3', from: '별빛팀 친구', text: '네 명이 한 명도 빠짐없이 다 같이 발표한 게 정말 멋졌어 👏', stars: 5, likes: 9, tag: '협동' },
  { id: 4, group: 'g4', from: '꽃잎팀 친구', text: '직접 만든 환경 보호 노래 너무 좋았어요! 아직도 흥얼거려요 🎵', stars: 5, likes: 6, tag: '창의성' },
  { id: 5, group: 'g5', from: '바다팀 친구', text: '꽃잎으로 만든 포스터가 예뻤어요. 다음엔 더 크게 보여주면 좋겠어요 😊', stars: 4, likes: 3, tag: '창의성' },
  { id: 6, group: 'g2', from: '별빛팀 친구', text: '자료 조사를 정말 많이 한 게 느껴졌어. 숫자랑 그래프가 멋졌어!', stars: 5, likes: 4, tag: '발표 내용' },
  { id: 7, group: 'g1', from: '꽃잎팀 친구', text: '서연이가 떨지 않고 끝까지 발표해서 대단했어요 ⭐', stars: 5, likes: 8, tag: '목소리·전달' },
  { id: 8, group: 'g3', from: '햇살팀 친구', text: '나무 심기 캠페인 아이디어 우리 반에서 진짜 해보면 좋겠어요!', stars: 5, likes: 5, tag: '협동' },
];

export const PAST_ACTIVITIES = [
  { title: '내가 좋아하는 위인', subject: '국어', date: '2026. 5. 15.', groups: 5, status: '완료' },
  { title: '재미있는 과학 실험', subject: '과학', date: '2026. 5. 8.',  groups: 6, status: '완료' },
  { title: '우리 가족 소개하기', subject: '국어', date: '2026. 4. 24.', groups: 5, status: '완료' },
];

export const EMOJI_SCALE = [
  { v: 1, e: '😅', label: '음…' },
  { v: 2, e: '🙂', label: '좋아요' },
  { v: 3, e: '😀', label: '잘했어요' },
  { v: 4, e: '😍', label: '최고예요' },
  { v: 5, e: '🤩', label: '대박이에요' },
];

export function groupAvg(g: { scores: Record<string, number> }) {
  const v = Object.values(g.scores);
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function getGroupColor(colorKey: string) {
  return GROUP_COLORS.find(c => c.key === colorKey) ?? GROUP_COLORS[0];
}

export function emojiFor(v: number) {
  const n = Math.max(1, Math.min(5, Math.round(v)));
  return EMOJI_SCALE.find(e => e.v === n) ?? EMOJI_SCALE[2];
}
