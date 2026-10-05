import { visa } from '@/content/menu';
import { formatDay, stampDate } from '@/lib/dates';

const STAMP_ID = 'stamp-visa';

/** Hidden SVG defs: the ink-bleed filter and the visa stamp symbol for the current country. */
export function StampDefs() {
  const country = visa.country.toUpperCase();
  // Long country names shrink so they stay inside the stamp's frame.
  const size = Math.min(40, Math.floor(210 / (country.length * 0.75)));
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves={3} seed={3} result="w" />
          <feColorMatrix in="w" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.42" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <symbol id={STAMP_ID} viewBox="0 0 260 156">
          <g filter="url(#ink)" fill="currentColor" style={{ fontFamily: 'var(--text)' }}>
            <rect x="5" y="5" width="250" height="146" rx="12" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="14" y="14" width="232" height="128" rx="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <text x="130" y="44" textAnchor="middle" fontSize="15" fontWeight="500" letterSpacing="3.5">THE CONSULATE</text>
            <line x1="34" y1="56" x2="226" y2="56" stroke="currentColor" strokeWidth="1.2" />
            <text x="130" y="98" textAnchor="middle" fontSize={size} fontWeight="600" letterSpacing="5">{country}</text>
            <line x1="34" y1="112" x2="226" y2="112" stroke="currentColor" strokeWidth="1.2" />
            <text x="130" y="132" textAnchor="middle" fontSize="12.5" fontWeight="500" letterSpacing="2">VISA VALID TO {stampDate(visa.validTo)}</text>
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

export function Stamp({ labelled = false }: { labelled?: boolean }) {
  return labelled ? (
    <svg className="stamp" viewBox="0 0 260 156" role="img" aria-label={`Visa stamp: ${visa.country}, valid to ${formatDay(visa.validTo, true)}`}>
      <use href={`#${STAMP_ID}`} />
    </svg>
  ) : (
    <svg className="stamp" viewBox="0 0 260 156" aria-hidden="true">
      <use href={`#${STAMP_ID}`} />
    </svg>
  );
}
