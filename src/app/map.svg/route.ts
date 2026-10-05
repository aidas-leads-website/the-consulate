// The flat map that replaces the globe without WebGL or JavaScript (requirement M3).
// Same land data, pins and route as the globe; equirectangular, so the engraved hatching
// becomes straight horizontal lines. Generated once at build time.
import { LAND } from '@/lib/globe/land';
import { home, itinerary, visa } from '@/content/menu';

export const dynamic = 'force-static';

const X = (lon: number) => (lon + 180) * 2;
const Y = (lat: number) => (90 - lat) * 2;
const f = (n: number) => +n.toFixed(1);

function svg() {
  const brass = '#C9A44C', ivory = '#ECE7D6';
  const top = Y(84), bottom = Y(-58), h = bottom - top;

  const hatch = LAND.h
    .filter((r) => r[0] / 10 > -58)
    .map((r) => {
      const y = f(Y(r[0] / 10));
      let d = '';
      for (let k = 1; k < r.length; k += 2) d += `M${r[k]} ${y}H${r[k + 1]}`;
      return d;
    })
    .join('');

  let coast = '';
  for (const line of LAND.c) {
    let prev: [number, number] | null = null;
    for (let i = 0; i + 1 < line.length; i += 2) {
      const lat = line[i + 1] / 10;
      if (lat < -60) { prev = null; continue; }
      const p: [number, number] = [f(X(line[i] / 10)), f(Y(lat))];
      coast += !prev || Math.abs(p[0] - prev[0]) > 180 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`;
      prev = p;
    }
  }

  let grat = '';
  for (let lon = -150; lon < 180; lon += 30) grat += `M${X(lon)} ${top}V${bottom}`;
  for (let lat = -30; lat <= 60; lat += 30) grat += `M0 ${Y(lat)}H720`;

  const stops = [home, ...itinerary];
  let route = '';
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    const x0 = X(a.lon), y0 = Y(a.lat), x1 = X(b.lon), y1 = Y(b.lat);
    const lift = Math.hypot(x1 - x0, y1 - y0) * 0.22;
    route += `M${f(x0)} ${f(y0)}Q${f((x0 + x1) / 2)} ${f((y0 + y1) / 2 - lift)} ${f(x1)} ${f(y1)}`;
  }

  const pin = (lat: number, lon: number, r: number, fill: string) => `<circle cx="${f(X(lon))}" cy="${f(Y(lat))}" r="${r}" fill="${fill}"/>`;
  const vx = f(X(visa.lon)), vy = f(Y(visa.lat));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${top} 720 ${h}" width="720" height="${h}">
<title>The places on The Consulate’s menu</title>
<rect x=".5" y="${top + 0.5}" width="719" height="${h - 1}" fill="none" stroke="${brass}" stroke-opacity=".35"/>
<path d="${grat}" stroke="${brass}" stroke-opacity=".12" stroke-width=".6" fill="none"/>
<path d="${hatch}" stroke="${brass}" stroke-opacity=".42" stroke-width=".6" fill="none"/>
<path d="${coast}" stroke="${brass}" stroke-opacity=".95" stroke-width=".7" fill="none" stroke-linejoin="round"/>
<path d="${route}" stroke="${ivory}" stroke-opacity=".85" stroke-width=".8" fill="none"/>
${itinerary.map((p) => pin(p.lat, p.lon, 2.6, brass)).join('')}
${pin(home.lat, home.lon, 3.4, ivory)}
${pin(visa.next.lat, visa.next.lon, 2.2, '#8F7A3E')}
<circle cx="${vx}" cy="${vy}" r="8" fill="none" stroke="#E36A55" stroke-width="1.2" stroke-opacity=".7"/>
${pin(visa.lat, visa.lon, 3.6, '#E36A55')}
<text x="${vx + 12}" y="${vy + 5}" fill="${ivory}" font-family="Futura, 'Century Gothic', 'Avenir Next', system-ui, sans-serif" font-size="15">${visa.country}</text>
<text x="${f(X(home.lon)) - 8}" y="${f(Y(home.lat)) + 5}" text-anchor="end" fill="${ivory}" font-family="Futura, 'Century Gothic', 'Avenir Next', system-ui, sans-serif" font-size="15">Atlanta</text>
</svg>`;
}

export function GET() {
  return new Response(svg(), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
  });
}
