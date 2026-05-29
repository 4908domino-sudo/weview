'use client';

import Link from 'next/link';
import TeacherShell from './TeacherShell';
import { ACTIVITY, PAST_ACTIVITIES } from '@/lib/data';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Progress from '@/components/ui/Progress';
import Icon from '@/components/ui/Icon';
import QRGlyph from '@/components/brand/QRGlyph';

const PRIMARY = 'var(--color-blue-50)';
const liveVotes = 18, totalStudents = 22;

export default function DashboardScreen() {
  return (
    <TeacherShell active="dashboard" wide>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--color-label-alternative)', fontWeight: 600 }}>안녕하세요, 박지영 선생님 👋</p>
          <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>오늘도 함께 자라는 교실</h1>
        </div>
        <Link href="/activities/new" style={{ textDecoration: 'none' }}>
          <Btn variant="primary" size="lg" color={PRIMARY} leftIcon="plus">새 활동 만들기</Btn>
        </Link>
      </div>

      {/* live activity banner */}
      <Card pad={0} radius={24} style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-status-positive)', boxShadow: '0 0 0 4px var(--color-green-95)' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-green-40)', letterSpacing: '0.02em' }}>진행 중</span>
              <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)">{ACTIVITY.subject}</Pill>
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>{ACTIVITY.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 18px' }}>
              <Progress value={liveVotes} max={totalStudents} color={PRIMARY} />
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-label-strong)', whiteSpace: 'nowrap' }}>{liveVotes}/{totalStudents}명 참여</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/results" style={{ textDecoration: 'none' }}>
                <Btn variant="primary" color={PRIMARY} rightIcon="arrow-right">실시간 결과 보기</Btn>
              </Link>
              <Link href="/activities/new" style={{ textDecoration: 'none' }}>
                <Btn variant="outline" leftIcon="camera">QR 다시 띄우기</Btn>
              </Link>
            </div>
          </div>
          <div style={{ width: 220, background: 'var(--color-blue-95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20 }}>
            <QRGlyph size={108} />
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, letterSpacing: '0.04em', color: 'var(--color-blue-40)' }}>{ACTIVITY.code}</div>
            <div style={{ fontSize: 12, color: 'var(--color-blue-40)', fontWeight: 600 }}>weview.kr/join</div>
          </div>
        </div>
      </Card>

      {/* quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: 'trophy',     color: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', num: '12',  label: '진행한 활동' },
          { icon: 'bubble-fill',color: 'var(--color-violet-50)', bg: 'var(--color-violet-95)', num: '486', label: '나눈 칭찬 댓글' },
          { icon: 'heart-fill', color: 'var(--color-pink-50)',   bg: 'var(--color-pink-95)',   num: '4.6', label: '평균 응원 별점' },
        ].map((s, i) => (
          <Card key={i} pad={20} radius={20} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={24} color={s.color} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--color-label-strong)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--color-label-neutral)', marginTop: 4 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* history */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>지난 활동</h3>
        <Btn variant="ghost" size="sm" rightIcon="chevron-right">전체 보기</Btn>
      </div>
      <Card pad={8} radius={20}>
        {PAST_ACTIVITIES.map((a, i) => (
          <Link key={i} href="/results" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 14px', borderRadius: 14, cursor: 'pointer', borderBottom: i < PAST_ACTIVITIES.length - 1 ? '1px solid var(--color-line-normal-neutral)' : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-coolNeutral-99)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-coolNeutral-98)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="document" size={22} color="var(--color-label-alternative)" />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-label-strong)' }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2 }}>{a.subject} · 모둠 {a.groups}개 · {a.date}</div>
              </div>
              <Pill size="sm" color="var(--color-green-40)" bg="var(--color-green-95)" icon="circle-check-fill">{a.status}</Pill>
              <Icon name="chevron-right" size={20} color="var(--color-label-assistive)" />
            </div>
          </Link>
        ))}
      </Card>
    </TeacherShell>
  );
}
