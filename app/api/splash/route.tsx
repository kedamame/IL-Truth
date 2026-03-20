import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030712',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {/* IL circle */}
        <div
          style={{
            width: '100px',
            height: '100px',
            border: '4px solid #f97316',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#f97316',
              fontFamily: 'sans-serif',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            IL
          </div>
        </div>
        {/* App name */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#f97316',
            fontFamily: 'sans-serif',
          }}
        >
          Truth
        </div>
      </div>
    ),
    { width: 200, height: 200 }
  );
}
