import { ImageResponse } from 'next/og';

export const alt = 'MetaCheck — Preview your site on Google, Facebook, Twitter & LinkedIn';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            textTransform: 'uppercase',
            letterSpacing: 6,
            opacity: 0.75,
            marginBottom: 12,
          }}
        >
          MetaCheck
        </div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          Preview your site on Google, Facebook, Twitter & LinkedIn
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 32,
            opacity: 0.85,
            maxWidth: 1000,
          }}
        >
          Meta tags, Open Graph, Twitter Cards, schema.org — audited in seconds.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 64,
            fontSize: 22,
            opacity: 0.7,
          }}
        >
          <span>google</span>
          <span>·</span>
          <span>facebook</span>
          <span>·</span>
          <span>twitter / x</span>
          <span>·</span>
          <span>linkedin</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
