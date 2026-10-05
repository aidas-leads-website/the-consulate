import { renderOg, ogContentType, ogSize } from '@/lib/og';

export const alt = 'Questions about The Consulate: the Visa menu, fees, parking, dress and allergies.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'Questions', title: 'Good questions.', line: 'The 90-day Visa menu, the service fee, parking, dress, allergies and corkage.' });
}
