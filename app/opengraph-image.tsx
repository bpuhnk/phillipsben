import { ImageResponse } from 'next/og';
import { loadInstrumentSerif } from '@/lib/og-font';

export const alt = 'Ben Phillips — Software for things that actually have to work.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const { regular, italic } = await loadInstrumentSerif();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FAF8F4',
          color: '#1A1816',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'Instrument Serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 28,
            letterSpacing: '-0.01em',
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: '#C2410C' }} />
          <span>ben phillips</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 104,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
          }}
        >
          <div style={{ display: 'flex' }}>Software for</div>
          <div style={{ display: 'flex' }}>
            <span>things that&nbsp;</span>
            <span style={{ fontStyle: 'italic', color: '#4A453E' }}>actually</span>
          </div>
          <div style={{ display: 'flex', fontStyle: 'italic', color: '#4A453E' }}>have to work.</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: '0.06em',
            color: '#8A8275',
            textTransform: 'uppercase',
          }}
        >
          <span>phillipsben.com</span>
          <span>Engineer · .NET · Agents</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: regular, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: italic, style: 'italic', weight: 400 },
      ],
    }
  );
}
