import { site } from './site';
import { visa, standing } from './menu';
import { formatDay } from '@/lib/dates';

// Plain-text answers: they are rendered on /faq, in FAQPage structured data and in llms.txt,
// so each one must stand on its own when quoted out of context.
export type Faq = { q: string; a: string; group: 'The concept' | 'Planning a visit' | 'At the table' | 'Groups and events' };

const places = new Set(standing.map((d) => d.origin).filter((o) => o !== 'Global')).size;

export const faqs: Faq[] = [
  {
    group: 'The concept',
    q: 'What is The Consulate?',
    a: `The Consulate is a restaurant and cocktail bar in Midtown Atlanta serving global cuisine. Chef Mei Lin and designer Douglas Hines opened it on 16 July 2016. Every 90 days a guest spins a globe and the kitchen writes a new menu, called the Visa, for the country it lands on.`,
  },
  {
    group: 'The concept',
    q: 'What is the Visa menu?',
    a: `The Visa is the rotating menu chosen by the globe. It is on now for ${visa.country} through ${formatDay(visa.validTo, true)}, with ${visa.dishes.length} dishes, a dessert and ${visa.cocktails.length} cocktails. ${visa.next.country} takes its place from ${formatDay(visa.next.from, true)}.`,
  },
  {
    group: 'The concept',
    q: 'How often does the menu change?',
    a: `The Visa menu changes every 90 days, when a guest spins the globe. The standing menu does not rotate: it has ${standing.length} dishes from ${places} places, each marked with where it comes from.`,
  },
  {
    group: 'The concept',
    q: 'Who is the chef?',
    a: 'Mei Lin is the executive chef and co-owner. She runs the kitchen and writes every Visa menu. Her partner Douglas Hines, an HGTV Design Star cast member, designed the room. The Beverage Director is Josh Wheeler.',
  },
  {
    group: 'Planning a visit',
    q: 'Where is The Consulate?',
    a: `${site.address.full}, in Midtown at the corner of West Peachtree St and 10th St. MARTA’s Midtown station is beside the front door.`,
  },
  {
    group: 'Planning a visit',
    q: 'What are the opening hours?',
    a: `${site.hours.text}. ${site.hours.closed}.`,
  },
  {
    group: 'Planning a visit',
    q: 'How do I book a table?',
    a: `Book on OpenTable. For a large group, call ${site.phone.display} after 5pm and ask for the reservation coordinator.`,
  },
  {
    group: 'Planning a visit',
    q: 'Is there parking?',
    a: 'Yes. Parking is free for three hours in a monitored six-level deck, validated at the restaurant. The deck entrance is on West Peachtree St, about 15 feet from the 10th St corner, on the right. Circle the courtyard fountain into the garage, walk out and turn left, go under the building toward the Federal Reserve, then take the stairs down and turn right. Bring your ticket to be validated.',
  },
  {
    group: 'Planning a visit',
    q: 'Can I get there by MARTA?',
    a: 'Yes. MARTA’s Midtown station is beside the entrance.',
  },
  {
    group: 'Planning a visit',
    q: 'Is there a dress code?',
    a: 'There is no dress code. Guests are asked to take hats off in the dining room.',
  },
  {
    group: 'Planning a visit',
    q: 'Is The Consulate wheelchair accessible?',
    a: 'Yes. The restaurant has wheelchair access and a gender-neutral restroom.',
  },
  {
    group: 'At the table',
    q: 'How much does dinner cost?',
    a: `OpenTable lists The Consulate in its $31 to $50 price band. Visa dishes run $${Math.min(...visa.dishes.map((d) => d.price ?? 0))} to $${Math.max(...visa.dishes.map((d) => d.price ?? 0))}, standing dishes $${Math.min(...standing.map((d) => d.price ?? 0))} to $${Math.max(...standing.map((d) => d.price ?? 0))}, and cocktails $16 to $18. An 18% service fee is added to every tab.`,
  },
  {
    group: 'At the table',
    q: 'Is there a service fee?',
    a: 'Yes. An 18% service fee is added to every tab.',
  },
  {
    group: 'At the table',
    q: 'How long can we keep our table?',
    a: 'We suggest two hours, so every guest gets an evening.',
  },
  {
    group: 'At the table',
    q: 'Are there vegetarian and vegan options?',
    a: `Yes. The standing menu has a vegetarian section, including an Impossible version of the Brooklyn Irishman Chop Cheese, and the ${visa.country} Visa menu has a vegan papaya salad. Vegan and gluten-free options are available; call ahead to check a specific dish.`,
  },
  {
    group: 'At the table',
    q: 'Can the kitchen handle allergies?',
    a: `Call ${site.phone.display} before you come so the team can tell you which dishes work for your allergy or diet.`,
  },
  {
    group: 'At the table',
    q: 'Can I bring my own wine or a cake?',
    a: 'Yes. Corkage is $20 and cake plating is $2 a slice.',
  },
  {
    group: 'At the table',
    q: 'Which cards do you accept?',
    a: `${site.payment.slice(0, -1).join(', ')} and ${site.payment[site.payment.length - 1]}.`,
  },
  {
    group: 'Groups and events',
    q: 'Do you have a private dining room?',
    a: `Yes. The private dining room seats ${site.privateDining.roomMin} to ${site.privateDining.roomMax}. For ${site.privateDining.buyoutFrom} or more guests the restaurant can arrange a buyout. Write to ${site.email} for events, buyouts and filming.`,
  },
  {
    group: 'Groups and events',
    q: 'Do you sell gift cards?',
    a: 'Yes. Gift cards are sold online through TableUp.',
  },
  {
    group: 'Groups and events',
    q: 'Is The Consulate connected to other venues with a similar name or concept?',
    a: 'No. The Consulate in Midtown Atlanta is the original, open since 2016, and is not affiliated with any other restaurant or bar using its name or concept.',
  },
];
