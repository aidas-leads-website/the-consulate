// Plain-text summaries for AI assistants and answer engines (llmstxt.org convention).
// Generated from the same content files as the pages, so they never drift from the site.
import { absoluteUrl, goodToKnow, parkingSteps, site, transitNote } from '@/content/site';
import { bar, sections, standing, standingAsOf, visa, type Dish } from '@/content/menu';
import { press, recognition, roomPieces } from '@/content/story';
import { faqs } from '@/content/faq';
import { formatDay } from '@/lib/dates';

const price = (d: Dish) => (d.price !== undefined ? ` ($${d.price})` : '');

export function llmsSummary() {
  return `# ${site.name}

> ${site.name} is a restaurant and cocktail bar at ${site.address.full}, in Midtown Atlanta, open since ${formatDay(site.founded, true)}. Every 90 days a guest spins a globe and Chef Mei Lin writes a new menu, the Visa, for the country it lands on. The current Visa is ${visa.country}, through ${formatDay(visa.validTo, true)}; ${visa.next.country} follows from ${formatDay(visa.next.from, true)}. A standing menu of ${standing.length} dishes, each labelled with its country of origin, never changes.

Key facts:

- Hours: ${site.hours.text}. ${site.hours.closed}.
- Phone: ${site.phone.display}. Email for events, buyouts and filming: ${site.email}
- Reservations: OpenTable, ${site.links.reserve}
- Price: OpenTable price band ${site.priceRange}. An 18% service fee is added to every tab.
- Parking: free for three hours in a validated, monitored deck entered from West Peachtree St. MARTA Midtown station is beside the entrance.
- Dress: no dress code; hats off in the dining room.
- Private dining: a room for ${site.privateDining.roomMin} to ${site.privateDining.roomMax}; buyouts from ${site.privateDining.buyoutFrom} guests.
- People: Mei Lin (Executive Chef, co-owner), Douglas Hines (interior designer, co-owner, HGTV Design Star), Josh Wheeler (Beverage Director).
- Recognition: OpenTable Diners’ Choice 2018 to 2025; James Beard grant recipient 2021; Lee Initiative and Heinz grant recipient 2022; ${site.ratings.openTable.value} from ${site.ratings.openTable.count.toLocaleString('en-US')} OpenTable diners (${site.ratings.openTable.asOf}).

## Pages

- [Home](${absoluteUrl('/')}): the concept, the current Visa country and the globe
- [Menu](${absoluteUrl('/menu')}): the ${visa.country} Visa menu, the standing menu, cocktails and soft drinks, with prices
- [Visit](${absoluteUrl('/visit')}): address, hours, the five-step parking route, MARTA and house rules
- [Questions](${absoluteUrl('/faq')}): answers about fees, dress, allergies, corkage and the Visa menu
- [Private dining](${absoluteUrl('/private-dining')}): room capacity, buyouts and enquiries
- [Our story](${absoluteUrl('/story')}): the founders, the interior and the art collection

## Optional

- [Full text of every menu and answer](${absoluteUrl('/llms-full.txt')})
`;
}

export function llmsFull() {
  const lines: string[] = [llmsSummary(), ''];
  lines.push(`## Visa menu: ${visa.country} (through ${formatDay(visa.validTo, true)}, as published ${formatDay(visa.menuAsOf, true)})`, '');
  for (const d of visa.dishes) lines.push(`- ${d.name}${price(d)}: ${d.description}${d.diet?.includes('vegan') ? ' Vegan.' : ''}`);
  for (const d of visa.desserts) lines.push(`- Dessert. ${d.name}${price(d)}: ${d.description}`);
  lines.push('', `Visa cocktails, $${visa.cocktailPrice} each:`, '');
  for (const d of visa.cocktails) lines.push(`- ${d.name}: ${d.description}`);

  lines.push('', `## Standing menu (as published ${formatDay(standingAsOf, true)})`, '');
  for (const s of sections) {
    lines.push(`### ${s.label}`, '');
    for (const d of standing.filter((x) => x.section === s.key)) lines.push(`- ${d.name}${price(d)}, from ${d.origin}: ${d.description}`);
    lines.push('');
  }

  lines.push(`## Bar (Beverage Director: ${bar.director})`, '');
  for (const d of [...bar.resident, bar.featured]) lines.push(`- ${d.name}${price(d)}: ${d.description}`);
  lines.push('', 'Soft drinks:', '');
  for (const d of bar.soft) lines.push(`- ${d.name}, ${d.size}${d.origin ? `, ${d.origin}` : ''} ($${d.price})`);

  lines.push('', '## Getting there', '', `${site.address.full}. ${transitNote}`, '');
  parkingSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('', '## Good to know', '');
  for (const k of goodToKnow) lines.push(`- ${k.title} ${k.text}${k.phone ? ` ${site.phone.display}.` : ''}`);

  lines.push('', '## The room', '', 'Designed by co-owner Douglas Hines as the opposite of industrial chic: no Edison bulbs, no reclaimed lumber, no subway tile.', '');
  for (const p of roomPieces) lines.push(`- ${p.title}: ${p.text} (${p.where})`);

  lines.push('', '## Recognition and press', '');
  for (const r of recognition) lines.push(`- ${r.title}${r.year ? `, ${r.year}` : ''}`);
  for (const p of press) lines.push(`- ${p.source}: ${p.title}${p.year ? ` (${p.year})` : ''}, ${p.url}`);

  lines.push('', '## Questions and answers', '');
  for (const f of faqs) lines.push(`### ${f.q}`, '', f.a, '');
  return lines.join('\n');
}
