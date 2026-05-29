'use client';

import Link from 'next/link';
import WeViewLogo from '@/components/brand/WeViewLogo';
import Viewy from '@/components/brand/Viewy';
import Btn from '@/components/ui/Btn';
import Avatar from '@/components/ui/Avatar';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';

const nav = [
  { id: 'dashboard', label: '대시보드', icon: 'home', href: '/dashboard' },
  { id: 'create',    label: '활동 만들기', icon: 'write', href: '/activities/new' },
  { id: 'results',   label: '결과', icon: 'trophy', href: '/results' },
];

interface TeacherShellProps {
  active: string;
  children: React.ReactNode;
  wide?: boolean;
}

export default function TeacherShell({ active, children, wide = false }: TeacherShellProps) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-sans)', background: 'var(--color-coolNeutral-99)' }}>
      <aside style={{ width: 232, flexShrink: 0, background: '#fff', borderRight: '1px solid var(--color-line-normal-neutral)', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
        <div style={{ padding: '4px 8px 20px' }}><WeViewLogo height={24} primary={PRIMARY} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map((n) => {
            const on = n.id === active;
            return (
              <Link key={n.id} href={n.href} style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: on ? 'var(--color-blue-95)' : 'transparent', color: on ? PRIMARY : 'var(--color-label-neutral)',
                  fontFamily: 'var(--font-sans)', fontWeight: on ? 800 : 600, fontSize: 15, transition: 'all .12s', textAlign: 'left', width: '100%',
                }}>
                  <Icon name={n.icon} size={20} color={on ? PRIMARY : 'var(--color-label-alternative)'} />{n.label}
                </button>
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', background: 'var(--color-coolNeutral-99)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <Viewy size={56} mood="happy" primary={PRIMARY} />
          <p style={{ margin: '6px 0 10px', fontSize: 13, color: 'var(--color-label-neutral)', lineHeight: 1.5 }}>학생 화면이 궁금하세요?</p>
          <Link href="/evaluate" style={{ textDecoration: 'none' }}>
            <Btn variant="soft" size="sm" full leftIcon="camera">학생 화면 보기</Btn>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 8px 4px', marginTop: 12, borderTop: '1px solid var(--color-line-normal-neutral)' }}>
          <Avatar name="박선생" size={36} colorKey="violet" />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-label-strong)' }}>박지영 선생님</div>
            <div style={{ fontSize: 12, color: 'var(--color-label-alternative)' }}>4학년 2반</div>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: wide ? 980 : 860, margin: '0 auto', padding: '32px 36px 56px' }}>{children}</div>
      </main>
    </div>
  );
}
