import { ImageResponse } from 'next/og';
import { globePaths } from '@/lib/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Home-screen icon: the engraved globe on lair green, turned to the current Visa country.
export default function AppleIcon() {
  const c = 90, R = 58, g = globePaths(c, c, R);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0E2A23' }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <ellipse cx={c} cy={c} rx={R * 0.93} ry={R * 1.2} fill="none" stroke="#8A6E2F" strokeWidth="3" />
          <circle cx={c} cy={c} r={R} fill="#0C2820" />
          <path d={g.hatch} stroke="#C9A44C" strokeOpacity="0.55" strokeWidth="0.8" fill="none" />
          <path d={g.coast} stroke="#C9A44C" strokeWidth="1" fill="none" />
          <circle cx={c} cy={c} r={R} fill="none" stroke="#C9A44C" strokeOpacity="0.6" strokeWidth="1.5" />
          <path d={`M${c} ${c - R * 1.2}A${R * 0.93} ${R * 1.2} 0 0 0 ${c} ${c + R * 1.2}`} fill="none" stroke="#C9A44C" strokeWidth="3" />
          {g.pin && <circle cx={g.pin[0]} cy={g.pin[1]} r="5" fill="#E36A55" />}
        </svg>
      </div>
    ),
    size,
  );
}
