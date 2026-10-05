import { renderOg, ogContentType, ogSize } from '@/lib/og';
import { standing, visa } from '@/content/menu';
import { formatDay, numberWord } from '@/lib/dates';

export const alt = `The Consulate menu: the ${visa.country} Visa menu and the global standing menu.`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: 'The menu',
    title: `${visa.country}, for now.`,
    line: `The Visa menu through ${formatDay(visa.validTo)}, plus ${numberWord(standing.length)} standing dishes from around the world.`,
  });
}
