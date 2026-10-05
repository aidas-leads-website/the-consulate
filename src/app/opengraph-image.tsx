import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { visa } from '@/content/menu';
import { formatDay } from '@/lib/dates';

export const alt = `The Consulate: an engraved brass desk globe turned to ${visa.country}, the current Visa menu.`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: 'Midtown Atlanta, since 2016',
    title: 'The Consulate',
    line: `Every 90 days a guest spins the globe. Now serving ${visa.country}, through ${formatDay(visa.validTo)}.`,
  });
}
