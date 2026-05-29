'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TeacherShell from './TeacherShell';
import { createClient } from '@/lib/supabase/client';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';

interface Activity {
  id: string;
  title: string;
  created_at: string;
  groups: { id: string; name: string; emoji: string }[];
  criteria: { key: string; label: string }[];
  session_id: string | null;
}

interface Props {
  activities: Activity[];
  teacherName: string;
  school: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export default function TeacherDashboard({ activities, teacherName, school }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <TeacherShell active="dashboard" wide>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--color-label-alternative)', fontWeight: 600 }}>
            안녕하세요, {teacherName} 선생님 👋{school && ` · ${school}`}
          </p>
          <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>
            오늘도 함께 자라는 교실
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" size="sm" onClick={handleLogout}>로그아웃</Btn>
          <Link href="/activities/new" style={{ textDecoration: 'none' }}>
            <Btn variant="primary" size="lg" color={PRIMARY} leftIcon="plus">새 활동 만들기</Btn>
          </Link>
        </div>
      </div>

      {/* 요약 스탯 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: 'trophy',     color: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', num: activities.length,  label: '진행한 활동' },
          { icon: 'persons',    color: 'var(--color-blue-50)',   bg: 'var(--color-blue-95)',   num: activities.reduce((n, a) => n + a.groups.length, 0), label: '누적 모둠 수' },
          { icon: 'sparkle-fill', color: 'var(--color-violet-50)', bg: 'var(--color-violet-95)', num: activities.reduce((n, a) => n + a.criteria.length, 0), label: '평가 기준 사용' },
        ].map((s, i) => (
          <Card key={i} pad={20} radius={20} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={24} color={s.color} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--color-label-strong)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--color-label-neutral)', marginTop: 4 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* 활동 목록 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>내 활동 기록</h3>
      </div>

      {activities.length === 0 ? (
        <Card pad={48} radius={24} style={{ textAlign: 'center', background: 'var(--color-coolNeutral-99)', border: 'none' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-label-neutral)' }}>아직 활동이 없어요</div>
          <p style={{ margin: '8px 0 20px', fontSize: 14, color: 'var(--color-label-assistive)' }}>첫 평가 활동을 만들어보세요!</p>
          <Link href="/activities/new" style={{ textDecoration: 'none' }}>
            <Btn variant="primary" size="md" color={PRIMARY} leftIcon="plus">활동 만들기</Btn>
          </Link>
        </Card>
      ) : (
        <Card pad={8} radius={20}>
          {activities.map((a, i) => (
            <div key={a.id}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 14px', borderRadius: 14, cursor: a.session_id ? 'pointer' : 'default', borderBottom: i < activities.length - 1 ? '1px solid var(--color-line-normal-neutral)' : 'none' }}
              onClick={() => a.session_id && router.push(`/results/${a.session_id}`)}
              onMouseEnter={e => { if (a.session_id) (e.currentTarget as HTMLElement).style.background = 'var(--color-coolNeutral-99)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-coolNeutral-98)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="document" size={22} color="var(--color-label-alternative)" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-label-strong)' }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2 }}>
                  모둠 {a.groups.length}개 · 기준 {a.criteria.length}개 · {formatDate(a.created_at)}
                </div>
              </div>
              {a.session_id ? (
                <Pill size="sm" color="var(--color-blue-40)" bg="var(--color-blue-95)" icon="arrow-right">결과 보기</Pill>
              ) : (
                <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)">세션 없음</Pill>
              )}
            </div>
          ))}
        </Card>
      )}
    </TeacherShell>
  );
}
