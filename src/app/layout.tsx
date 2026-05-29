import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeView — 함께 보고, 함께 자라요',
  description: '초등학교 교실을 위한 동료 평가 플랫폼. 이모지로 친구를 응원해요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
