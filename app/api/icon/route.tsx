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
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Orange border ring */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '8px solid #f97316',
            borderRadius: '80px',
            display: 'flex',
          }}
        />
        {/* IL text */}
        <div
          style={{
            fontSize: '200px',
            fontWeight: 900,
            color: '#f97316',
            fontFamily: 'sans-serif',
            letterSpacing: '-8px',
            lineHeight: 1,
          }}
        >
          IL
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
