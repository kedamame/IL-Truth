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
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(31,41,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(31,41,55,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex',
          }}
        />

        {/* Orange accent bar top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #f97316, #ea580c)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '100px',
              fontWeight: 900,
              color: '#f97316',
              letterSpacing: '-4px',
              lineHeight: 1,
            }}
          >
            IL Truth
          </div>
          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#9ca3af',
              letterSpacing: '2px',
            }}
          >
            Your LP position, honestly.
          </div>

          {/* Stats cards */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
            {[
              { label: 'Impermanent Loss', value: '-5.72%', color: '#ef4444' },
              { label: 'vs HODL (fees)', value: '+2.31%', color: '#22c55e' },
              { label: 'Realized PnL', value: '+$312', color: '#22c55e' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(17,24,39,0.8)',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '20px 36px',
                  gap: '8px',
                }}
              >
                <div style={{ color: '#6b7280', fontSize: '18px' }}>{item.label}</div>
                <div style={{ color: item.color, fontSize: '36px', fontWeight: 700 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol tags */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            display: 'flex',
            gap: '20px',
            color: '#4b5563',
            fontSize: '20px',
          }}
        >
          {['Uniswap V2', 'Uniswap V3', 'Aerodrome', 'Raydium'].map((p, i, arr) => (
            <div key={p} style={{ display: 'flex', gap: '20px' }}>
              <span>{p}</span>
              {i < arr.length - 1 && <span style={{ color: '#374151' }}>·</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 800 }
  );
}
