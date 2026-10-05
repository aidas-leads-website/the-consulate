// Business facts. Single source for the page copy, structured data, llms.txt and OG images.
// Sources: Data.md (live site and OpenTable, scraped 5 October 2026).

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.theconsulateatlanta.com').replace(/\/$/, '');

export const site = {
  name: 'The Consulate',
  descriptor: 'Global cuisine and craft cocktails',
  tagline: 'Where people come to Bond',
  url: SITE_URL,
  // Concept mode (the default) keeps the build out of search engines and shows the
  // "redesign concept" line in the footer. Set SITE_LIVE=true on the production deploy.
  live: process.env.SITE_LIVE === 'true',

  address: {
    street: '10 10th St NW, P200',
    locality: 'Atlanta',
    region: 'GA',
    postalCode: '30309',
    country: 'US',
    full: '10 10th St NW, P200, Atlanta, GA 30309',
  },
  geo: { lat: 33.781715, lon: -84.3871326 },
  neighborhood: 'Midtown',
  crossStreet: 'West Peachtree St and 10th St',

  phone: { display: '(404) 254-5760', tel: '+14042545760', schema: '+1-404-254-5760' },
  email: 'dh@theconsulateatlanta.com',

  hours: {
    // Days are JavaScript weekday numbers (0 = Sunday), hours in Atlanta time.
    days: [2, 3, 4, 5, 6],
    dayNames: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: 17,
    closes: 23,
    text: 'Tuesday to Saturday, 5pm to 11pm',
    closed: 'Closed Sunday and Monday',
  },

  founded: '2016-07-16',
  priceRange: '$31 to $50',
  cuisines: ['Global', 'International', 'Vietnamese'],
  payment: ['Visa', 'Mastercard', 'American Express', 'Discover'],

  links: {
    reserve:
      'https://www.opentable.com/r/the-consulate-reservations-atlanta?restref=335032&lang=en-US&ot_source=Restaurant%20website',
    openTable: 'https://www.opentable.com/r/the-consulate-reservations-atlanta',
    giftCards: 'https://app.tableup.com/r/6127/home',
    instagram: 'https://www.instagram.com/theconsulateatl/',
    facebook: 'https://www.facebook.com/TheConsulateATL',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=The%20Consulate%2010%2010th%20St%20NW%20P200%20Atlanta%2C%20GA%2030309',
    map: 'https://www.google.com/maps/search/?api=1&query=The%20Consulate%2010%2010th%20St%20NW%20P200%20Atlanta%2C%20GA%2030309',
  },

  privateDining: { roomMin: 8, roomMax: 12, buyoutFrom: 20 },

  people: [
    { name: 'Mei Lin', role: 'Executive Chef and co-owner', note: 'Appeared on CBS46 “Atlanta Plugged In”. Native New Yorker.' },
    { name: 'Douglas Hines', role: 'Interior designer and co-owner', note: 'HGTV Design Star cast member. Native New Yorker.' },
    { name: 'Josh Wheeler', role: 'Beverage Director', note: '' },
  ],

  amenities: [
    'Bar and lounge',
    'Patio',
    'Private dining room',
    'Wheelchair access',
    'Gender-neutral restroom',
    'Vegan and gluten-free options',
    'Free validated parking',
  ],

  ratings: { openTable: { value: 4.7, count: 2449, asOf: 'Oct 2026' } },
} as const;

export const parkingSteps = [
  'Drive along West Peachtree St. The deck entrance is on the right, about 15 feet from the 10th St corner.',
  'Enter the courtyard and circle the water fountain into the garage.',
  'Park, walk out of the garage and turn left.',
  'Walk under the building, toward the Federal Reserve.',
  'Take the stairs down and turn right. Bring your ticket and we will validate it.',
];

export const transitNote = 'Coming by train? MARTA’s Midtown station is beside our front door.';

export const goodToKnow: { title: string; text: string; phone?: boolean }[] = [
  { title: 'Service fee.', text: '18% is added to every tab.' },
  { title: 'Your table.', text: 'We suggest two hours, so every guest gets an evening.' },
  { title: 'Dress.', text: 'There is no dress code. We ask that hats come off in the dining room.' },
  { title: 'Allergies and dietary needs.', text: 'Call us before you come:', phone: true },
  { title: 'Bringing something.', text: 'Corkage is $20. Cake plating is $2 a slice.' },
];

export const absoluteUrl = (path = '/') => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;

