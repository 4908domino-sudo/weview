'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WeViewLogo from '@/components/brand/WeViewLogo';
import Viewy from '@/components/brand/Viewy';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';

function SoftBlob({ color, size, top, left, right, bottom, opacity = 0.5 }: {
  color: string; size: number; top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string; opacity?: number;
}) {
  return (
    <div style={{
      position: 'absolute', width: size, height: size, borderRadius: '50%',
      background: color, filter: 'blur(8px)', opacity,
      top, left, right, bottom, pointerEvents: 'none',
    }} />
  );
}

function CodeJoinModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError('참여 코드를 입력해주세요.'); return; }
    // Demo: any code works — navigate to evaluate screen
    router.push('/evaluate');
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'var(--color-material-dimmer)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 28, padding: '36px 32px 32px', width: 400, maxWidth: '100%', boxShadow: 'var(--shadow-heavy)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'var(--color-coolNeutral-98)', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--color-blue-95)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name="persons" size={28} color="var(--color-blue-50)" />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>코드로 참여하기</h2>
          <p style={{ margin: '0 0 24px', fontSize: 14.5, color: 'var(--color-label-neutral)', lineHeight: 1.55 }}>
            선생님이 알려준 참여 코드를 입력하면<br />바로 평가 활동에 참여할 수 있어요.
          </p>
        </div>

        <input
          ref={inputRef}
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
          placeholder="예: WV-3842"
          autoFocus
          style={{
            width: '100%', height: 56, borderRadius: 14, textAlign: 'center',
            border: `2px solid ${error ? 'var(--color-status-destructive)' : 'var(--color-line-normal-normal)'}`,
            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em',
            color: 'var(--color-label-strong)', outline: 'none', boxSizing: 'border-box',
            background: error ? 'var(--color-red-95)' : '#fff',
            transition: 'border-color .15s, background .15s',
          }}
        />
        {error && (
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--color-status-destructive)', fontWeight: 600, textAlign: 'center' }}>{error}</p>
        )}

        <div style={{ marginTop: 20 }}>
          <Btn variant="primary" size="lg" full color={PRIMARY} onClick={handleJoin} rightIcon="arrow-right">
            참여하기
          </Btn>
        </div>

        <p style={{ margin: '16px 0 0', fontSize: 12.5, color: 'var(--color-label-assistive)', textAlign: 'center' }}>
          QR코드가 작동하지 않을 때 코드를 직접 입력해 참여할 수 있어요.
        </p>
      </div>
    </div>
  );
}

const feats = [
  { icon: 'star-fill',   color: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', title: '이모지로 칭찬해요',  desc: '복잡한 점수 대신 이모지 하나로 친구의 발표를 응원해요.' },
  { icon: 'bubble-fill', color: 'var(--color-violet-50)', bg: 'var(--color-violet-95)', title: '따뜻한 한마디',     desc: '"이런 점이 멋졌어!" 짧고 다정한 칭찬 댓글을 남겨요.' },
  { icon: 'persons',     color: 'var(--color-green-50)',  bg: 'var(--color-green-95)',  title: '모두가 주인공',     desc: '순위를 겨루기보다 모든 모둠의 강점을 함께 발견해요.' },
  { icon: 'sparkle-fill',color: 'var(--color-cyan-50)',   bg: 'var(--color-cyan-95)',   title: 'QR로 바로 참여',   desc: '태블릿·휴대폰으로 QR을 찍으면 1초 만에 평가 시작.' },
];

const steps = [
  { n: '1', title: '활동을 만들어요',  desc: '선생님이 모둠과 평가 기준을 정하고 활동을 시작해요.', color: 'var(--color-blue-50)' },
  { n: '2', title: 'QR로 참여해요',    desc: '학생들이 QR을 찍고 친구들의 발표를 평가해요.',         color: 'var(--color-violet-50)' },
  { n: '3', title: '함께 성장해요',    desc: '따뜻한 피드백과 결과를 모두 함께 확인해요.',             color: 'var(--color-green-50)' },
];

export default function LandingScreen() {
  const [showCodeModal, setShowCodeModal] = useState(false);

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-label-normal)', background: '#fff', minHeight: '100vh' }}>

      {/* nav — 학생 참여 버튼 없음 */}
      <header style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--color-line-normal-neutral)', zIndex: 10 }}>
        <WeViewLogo height={26} primary={PRIMARY} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/activities/new" style={{ textDecoration: 'none' }}>
            <Btn variant="primary" size="sm" color={PRIMARY} rightIcon="arrow-right">활동 만들기</Btn>
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '72px 40px 64px', background: 'linear-gradient(180deg, var(--color-blue-99), #fff)' }}>
        <SoftBlob color="var(--color-blue-90)"   size={260} top={-40} left={-60}  opacity={0.5} />
        <SoftBlob color="var(--color-violet-90)" size={200} top={40}  right={120} opacity={0.45} />
        <SoftBlob color="var(--color-green-90)"  size={160} bottom={-30} left={'30%'} opacity={0.4} />
        <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
          <div>
            <Pill icon="sparkle-fill" color="var(--color-violet-40)" bg="var(--color-violet-95)" style={{ marginBottom: 20 }}>우리 반 동료 평가, 따뜻하게</Pill>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 52, lineHeight: 1.18, letterSpacing: '-0.035em', color: 'var(--color-label-strong)' }}>
              함께 보고,<br /><span style={{ color: PRIMARY }}>함께 자라요</span>
            </h1>
            <p style={{ margin: '20px 0 0', fontSize: 19, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 420 }}>
              WeView는 초등학교 교실을 위한 동료 평가 플랫폼이에요. 점수를 매기는 대신, 친구의 발표에서 멋진 점을 발견하고 따뜻한 칭찬을 나눠요.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <Link href="/activities/new" style={{ textDecoration: 'none' }}>
                <Btn variant="primary" size="lg" color={PRIMARY} rightIcon="arrow-right">활동 만들기</Btn>
              </Link>
              <Btn variant="outline" size="lg" leftIcon="persons" onClick={() => setShowCodeModal(true)}>
                코드로 참여하기
              </Btn>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'var(--color-blue-95)', opacity: 0.7 }} />
            <Viewy size={260} mood="celebrate" primary={PRIMARY} />
            <div style={{ position: 'absolute', top: 6, right: 6, background: '#fff', borderRadius: 16, padding: '10px 14px', boxShadow: 'var(--shadow-strong)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="star-fill" size={20} color="var(--color-orange-50)" /><span style={{ fontWeight: 800, fontSize: 15 }}>최고예요!</span>
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 0, background: '#fff', borderRadius: 16, padding: '10px 14px', boxShadow: 'var(--shadow-strong)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>💬</span><span style={{ fontWeight: 700, fontSize: 14 }}>발표 정말 잘했어!</span>
            </div>
          </div>
        </div>
      </section>

      {/* feature cards */}
      <section style={{ padding: '64px 40px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>평가가 응원이 되는 순간</h2>
          <p style={{ margin: '12px 0 0', fontSize: 17, color: 'var(--color-label-neutral)' }}>경쟁이 아니라 서로의 성장을 돕는 평가를 만들어요.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {feats.map((f, i) => (
            <Card key={i} pad={24} radius={24} hover style={{ textAlign: 'left' }}>
              <span style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: 16, background: f.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name={f.icon} size={26} color={f.color} />
              </span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-label-neutral)' }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section style={{ padding: '24px 40px 72px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ background: 'var(--color-coolNeutral-99)', borderRadius: 32, padding: '48px 40px' }}>
          <h2 style={{ margin: '0 0 36px', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>3단계로 끝나는 수업 평가</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 16 }}>{s.n}</span>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>{s.title}</h3>
                <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.55, color: 'var(--color-label-neutral)', maxWidth: 240 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 72px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 32, padding: '56px 48px', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <SoftBlob color="rgba(255,255,255,0.18)" size={220} top={-60}  right={120} opacity={1} />
          <SoftBlob color="rgba(255,255,255,0.12)" size={160} bottom={-50} right={-20} opacity={1} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em' }}>오늘 수업부터 시작해 볼까요?</h2>
            <p style={{ margin: '12px 0 0', fontSize: 17, opacity: 0.92 }}>3분이면 첫 평가 활동을 만들 수 있어요. 로그인도, 설치도 필요 없어요.</p>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Link href="/activities/new" style={{ textDecoration: 'none' }}>
              <Btn variant="white" size="lg" color={PRIMARY} rightIcon="arrow-right">무료로 체험하기</Btn>
            </Link>
          </div>
        </div>
        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, color: 'var(--color-label-alternative)', fontSize: 13 }}>
          <WeViewLogo height={18} primary={PRIMARY} />
          <span>© 2026 WeView · 함께 보고, 함께 자라요</span>
        </footer>
      </section>

      {/* 코드 참여 모달 */}
      {showCodeModal && <CodeJoinModal onClose={() => setShowCodeModal(false)} />}
    </div>
  );
}
