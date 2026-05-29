'use client';

// Design Ref: §5.3 QRCodeDisplay — 외부 QR API 사용 (qrserver.com)
// 패키지 없음. 인터넷 접속만 필요 (교실 환경 가정).

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export default function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=${size}x${size}&margin=12&bgcolor=ffffff`;

  return (
    <div style={{
      background: '#fff', padding: 10, borderRadius: 12,
      boxShadow: 'var(--shadow-emphasize)', display: 'inline-flex',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={size}
        height={size}
        alt={`QR code for ${url}`}
        style={{ display: 'block', borderRadius: 4 }}
      />
    </div>
  );
}
