'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import WeViewLogo from '@/components/brand/WeViewLogo';
import Viewy from '@/components/brand/Viewy';
import Btn from '@/components/ui/Btn';

const PRIMARY = 'var(--color-blue-50)';

interface AuthScreenProps {
  mode: 'login' | 'signup';
}

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false); // 회원가입 이메일 발송 완료

  const inputStyle = (hasError?: boolean) => ({
    width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
    border: `1.5px solid ${hasError ? 'var(--color-status-destructive)' : 'var(--color-line-normal-normal)'}`,
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 16,
    color: 'var(--color-label-strong)', outline: 'none',
    boxSizing: 'border-box' as const, background: '#fff',
    transition: 'border-color .15s',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setDone(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '오류가 발생했어요.';
      if (msg.includes('Invalid login credentials')) setError('이메일 또는 비밀번호가 틀렸어요.');
      else if (msg.includes('Email not confirmed')) setError('이메일 인증을 먼저 완료해주세요.');
      else if (msg.includes('already registered')) setError('이미 가입된 이메일이에요.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--color-blue-99) 0%, var(--color-violet-99) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* 로고 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <Viewy size={80} mood="happy" primary={PRIMARY} />
          <div style={{ marginTop: 12 }}>
            <WeViewLogo height={28} primary={PRIMARY} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'var(--color-label-neutral)', textAlign: 'center' }}>
            {mode === 'login' ? '교사 계정으로 로그인하세요' : '교사 계정을 만들어보세요'}
          </p>
        </div>

        {/* 카드 */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', boxShadow: 'var(--shadow-strong)' }}>

          {done ? (
            // 회원가입 완료 → 이메일 확인 안내
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: 'var(--color-label-strong)' }}>이메일을 확인해주세요</h2>
              <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-label-neutral)', lineHeight: 1.6 }}>
                <strong>{email}</strong>로 인증 링크를 보냈어요.<br />
                이메일의 링크를 클릭하면 로그인됩니다.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <Btn variant="outline" size="md" full>로그인 화면으로</Btn>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 800, color: 'var(--color-label-strong)' }}>
                {mode === 'login' ? '로그인' : '회원가입'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 7 }}>이름</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 박지영" required style={inputStyle()} />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 7 }}>이메일</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@school.kr" required style={inputStyle(!!error)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 7 }}>비밀번호</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? '6자 이상' : '비밀번호 입력'} required minLength={6} style={inputStyle(!!error)} />
                </div>
              </div>

              {error && (
                <p style={{ margin: '12px 0 0', fontSize: 13.5, color: 'var(--color-status-destructive)', fontWeight: 600 }}>
                  {error}
                </p>
              )}

              <div style={{ marginTop: 22 }}>
                <Btn variant="primary" size="lg" full color={PRIMARY} type="submit" disabled={loading}>
                  {loading ? (mode === 'login' ? '로그인 중...' : '가입 중...') : (mode === 'login' ? '로그인' : '회원가입')}
                </Btn>
              </div>

              <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: 14, color: 'var(--color-label-alternative)' }}>
                {mode === 'login' ? (
                  <>계정이 없으신가요? <Link href="/auth/signup" style={{ color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>회원가입</Link></>
                ) : (
                  <>이미 계정이 있으신가요? <Link href="/auth/login" style={{ color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>로그인</Link></>
                )}
              </p>
            </form>
          )}
        </div>

        {/* 무료 체험 링크 */}
        <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: 13.5, color: 'var(--color-label-alternative)' }}>
          로그인 없이 사용하려면?{' '}
          <Link href="/activities/new" style={{ color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>
            무료 체험하기 →
          </Link>
        </p>
      </div>
    </div>
  );
}
