// Open Graph images (requirement S2): the desk globe drawn flat from the same land data,
// turned to the current Visa country, beside a page-specific headline. Rendered at build time.
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { LAND } from '@/lib/globe/land';
import { visa } from '@/content/menu';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const D = Math.PI / 180;
const f = (n: number) => n.toFixed(1);

/** Orthographic projection of the engraved globe, as SVG path data. */
export function globePaths(cx: number, cy: number, R: number, lon0 = visa.lon, lat0 = visa.lat * 0.8) {
  const s0 = Math.sin(lat0 * D), c0 = Math.cos(lat0 * D);
  const proj = (lat: number, lon: number): [number, number] | null => {
    const la = lat * D, dl = (lon - lon0) * D;
    const cosc = s0 * Math.sin(la) + c0 * Math.cos(la) * Math.cos(dl);
    if (cosc < 0.02) return null;
    return [cx + R * Math.cos(la) * Math.sin(dl), cy - R * (c0 * Math.sin(la) - s0 * Math.cos(la) * Math.cos(dl))];
  };
  const polyline = (pts: [number, number][]) => {
    let d = '', pen = false;
    for (const [lat, lon] of pts) {
      const p = proj(lat, lon);
      if (!p) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`;
      pen = true;
    }
    return d;
  };

  let hatch = '';
  for (const row of LAND.h) {
    const lat = row[0] / 10;
    for (let k = 1; k < row.length; k += 2) {
      const a = -180 + row[k] * 0.5, b = -180 + row[k + 1] * 0.5, n = Math.max(1, Math.ceil((b - a) / 3));
      const pts: [number, number][] = [];
      for (let j = 0; j <= n; j++) pts.push([lat, a + ((b - a) * j) / n]);
      hatch += polyline(pts);
    }
  }
  let coast = '';
  for (const line of LAND.c) {
    const pts: [number, number][] = [];
    for (let i = 0; i + 1 < line.length; i += 2) pts.push([line[i + 1] / 10, line[i] / 10]);
    coast += polyline(pts);
  }
  let grat = '';
  for (let lon = -180; lon < 180; lon += 30) { const pts: [number, number][] = []; for (let la = -84; la <= 84; la += 4) pts.push([la, lon]); grat += polyline(pts); }
  for (let lat = -60; lat <= 60; lat += 30) { const pts: [number, number][] = []; for (let lo = -180; lo <= 180; lo += 4) pts.push([lat, lo]); grat += polyline(pts); }
  const pin = proj(visa.lat, visa.lon);
  return { hatch, coast, grat, pin };
}

function Globe({ cx, cy, R }: { cx: number; cy: number; R: number }) {
  const g = globePaths(cx, cy, R);
  const brass = '#C9A44C';
  return (
    <svg width={ogSize.width} height={ogSize.height} viewBox={`0 0 ${ogSize.width} ${ogSize.height}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <radialGradient id="ball" cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#1B4A3C" />
          <stop offset="0.55" stopColor="#0C2820" />
          <stop offset="1" stopColor="#05110D" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.78" stopColor={brass} stopOpacity="0.22" />
          <stop offset="1" stopColor={brass} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`rotate(-7.4 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={R * 1.2} fill="url(#glow)" />
        {/* meridian ring: the back half goes behind the ball, the front half is drawn over it */}
        <ellipse cx={cx} cy={cy} rx={R * 0.93} ry={R * 1.13} fill="none" stroke="#8A6E2F" strokeWidth="5" />
        <circle cx={cx} cy={cy} r={R} fill="url(#ball)" />
        <path d={g.grat} stroke={brass} strokeOpacity="0.14" strokeWidth="1" fill="none" />
        <path d={g.hatch} stroke={brass} strokeOpacity="0.5" strokeWidth="1" fill="none" />
        <path d={g.coast} stroke={brass} strokeOpacity="0.95" strokeWidth="1.3" fill="none" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={brass} strokeOpacity="0.45" strokeWidth="2" />
        <path d={`M${cx} ${cy - R * 1.13}A${R * 0.93} ${R * 1.13} 0 0 0 ${cx} ${cy + R * 1.13}`} fill="none" stroke="#C9A44C" strokeWidth="5" />
        <circle cx={cx} cy={cy - R * 1.15} r="8" fill="#B28E3D" />
        <circle cx={cx} cy={cy + R * 1.15} r="8" fill="#B28E3D" />
        {g.pin && <circle cx={g.pin[0]} cy={g.pin[1]} r="20" fill="none" stroke="#E36A55" strokeWidth="3" strokeOpacity="0.75" />}
        {g.pin && <circle cx={g.pin[0]} cy={g.pin[1]} r="9" fill="#E36A55" />}
      </g>
    </svg>
  );
}

const fontsPromise = (async () => {
  const dir = join(process.cwd(), 'assets/fonts');
  const [bodoni, jost, jost500] = await Promise.all([
    readFile(join(dir, 'BodoniModa-Italic-500.ttf')),
    readFile(join(dir, 'Jost-400.ttf')),
    readFile(join(dir, 'Jost-500.ttf')),
  ]);
  return [
    { name: 'Bodoni', data: bodoni, style: 'italic' as const, weight: 500 as const },
    { name: 'Jost', data: jost, style: 'normal' as const, weight: 400 as const },
    { name: 'Jost', data: jost500, style: 'normal' as const, weight: 500 as const },
  ];
})();

export async function renderOg({ eyebrow, title, line }: { eyebrow: string; title: string; line: string }) {
  const fonts = await fontsPromise;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0E2A23', color: '#ECE7D6', fontFamily: 'Jost' }}>
        <Globe cx={935} cy={322} R={232} />
        <div style={{ position: 'absolute', left: 72, top: 70, bottom: 64, width: 610, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: '#C9A44C' }}>{eyebrow}</div>
          <div style={{ fontFamily: 'Bodoni', fontStyle: 'italic', fontSize: title.length > 18 ? 84 : 112, lineHeight: 0.95, letterSpacing: '-0.02em', marginTop: 'auto' }}>{title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: '#C7D2C8', marginTop: 28 }}>{line}</div>
          <div style={{ display: 'flex', marginTop: 'auto', fontSize: 22, color: '#A9B8AC', borderTop: '1px solid rgba(201,164,76,.35)', paddingTop: 18 }}>
            The Consulate · 10 10th St NW, Midtown Atlanta
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
