import { renderOg, ogContentType, ogSize } from '@/lib/og';

export const alt = 'The story of The Consulate: Chef Mei Lin, designer Douglas Hines and the room.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'Our story', title: 'Mei, Doug and the room.', line: 'No Edison bulbs. No reclaimed lumber. No subway tile. Since 16 July 2016.' });
}
