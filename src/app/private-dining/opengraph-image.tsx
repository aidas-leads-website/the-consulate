import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { site } from '@/content/site';

const { roomMin, roomMax, buyoutFrom } = site.privateDining;

export const alt = `Private dining at The Consulate: a room for ${roomMin} to ${roomMax}, buyouts from ${buyoutFrom}.`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'Private dining', title: 'A room of your own.', line: `A private room for ${roomMin} to ${roomMax}. The whole restaurant for ${buyoutFrom} or more.` });
}
