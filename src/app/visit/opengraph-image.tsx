import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { site } from '@/content/site';

export const alt = 'Visit The Consulate: hours, free parking and directions in Midtown Atlanta.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'Visit', title: 'The last stop is ours.', line: `${site.hours.text}. Free validated parking, and MARTA Midtown beside the door.` });
}
