// schema.org structured data (requirement S1). Every page carries the Restaurant and WebSite
// nodes; pages add their own. Nodes share @ids so search engines and AI assistants can join them.
import { absoluteUrl, parkingSteps, site } from '@/content/site';
import { bar, sections, standing, standingAsOf, visa, type Dish } from '@/content/menu';
import { recognition } from '@/content/story';
import { faqs } from '@/content/faq';

type Node = Record<string, unknown>;

export const ids = {
  restaurant: absoluteUrl('/#restaurant'),
  website: absoluteUrl('/#website'),
  menu: absoluteUrl('/menu#menu'),
};

const DAY_URL = (d: string) => `https://schema.org/${d}`;
const DIET_URL = { vegan: 'https://schema.org/VeganDiet', vegetarian: 'https://schema.org/VegetarianDiet', 'gluten-free': 'https://schema.org/GlutenFreeDiet' } as const;
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;

export function restaurant(): Node {
  return {
    '@type': 'Restaurant',
    '@id': ids.restaurant,
    name: site.name,
    alternateName: 'The Consulate Atlanta',
    description: `${site.descriptor} in Midtown Atlanta. Every 90 days a guest spins a globe and Chef Mei Lin writes a new menu, the Visa, for the country it lands on. Now serving ${visa.country}.`,
    slogan: site.tagline,
    url: absoluteUrl('/'),
    image: [absoluteUrl('/opengraph-image')],
    logo: absoluteUrl('/apple-icon'),
    telephone: site.phone.schema,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    hasMap: site.links.map,
    containedInPlace: { '@type': 'Place', name: 'Midtown, Atlanta' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: site.hours.dayNames.map(DAY_URL), opens: hh(site.hours.opens), closes: hh(site.hours.closes) },
    ],
    servesCuisine: [...site.cuisines],
    priceRange: '$31-$50',
    currenciesAccepted: 'USD',
    paymentAccepted: site.payment.join(', '),
    acceptsReservations: true,
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.links.reserve,
        inLanguage: 'en-US',
        actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
      },
      result: { '@type': 'FoodEstablishmentReservation', name: `Table at ${site.name}` },
    },
    hasMenu: { '@id': ids.menu },
    founder: site.people.slice(0, 2).map((p) => ({ '@type': 'Person', name: p.name, jobTitle: p.role })),
    employee: site.people.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: p.role })),
    foundingDate: site.founded,
    amenityFeature: site.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    award: recognition.slice(0, 5).map((r) => (r.year ? `${r.title}, ${r.year}` : r.title)),
    publicAccess: true,
    sameAs: [site.links.instagram, site.links.facebook, site.links.openTable],
  };
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    alternateName: 'The Consulate Atlanta',
    url: absoluteUrl('/'),
    inLanguage: 'en-US',
    publisher: { '@id': ids.restaurant },
  };
}

function item(d: Dish, extra: { origin?: string; validThrough?: string } = {}): Node {
  const description = extra.origin && extra.origin !== 'Global' ? `${d.description} Origin: ${extra.origin}.` : d.description;
  const node: Node = { '@type': 'MenuItem', name: d.name, description };
  const price = d.price;
  if (price !== undefined) {
    node.offers = { '@type': 'Offer', price: price.toFixed(2), priceCurrency: 'USD', ...(extra.validThrough ? { validThrough: extra.validThrough } : {}) };
  }
  if (d.diet?.length) node.suitableForDiet = d.diet.map((x) => DIET_URL[x]);
  return node;
}

export function menu(): Node {
  const v = { validThrough: visa.validTo };
  return {
    '@type': 'Menu',
    '@id': ids.menu,
    name: `${site.name} menu`,
    url: absoluteUrl('/menu'),
    inLanguage: 'en-US',
    dateModified: standingAsOf,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: `Visa menu: ${visa.country}`,
        description: `The rotating menu chosen by the globe, served through ${visa.validTo}. ${visa.next.country} follows from ${visa.next.from}.`,
        hasMenuItem: visa.dishes.map((d) => item(d, v)),
      },
      { '@type': 'MenuSection', name: `Visa dessert: ${visa.country}`, hasMenuItem: visa.desserts.map((d) => item(d, v)) },
      {
        '@type': 'MenuSection',
        name: `Visa cocktails: ${visa.country}`,
        hasMenuItem: visa.cocktails.map((d) => item({ ...d, price: visa.cocktailPrice }, v)),
      },
      ...sections.map((s) => ({
        '@type': 'MenuSection',
        name: s.label,
        hasMenuItem: standing.filter((d) => d.section === s.key).map((d) => item(d, { origin: d.origin })),
      })),
      { '@type': 'MenuSection', name: 'Resident cocktails', hasMenuItem: [...bar.resident, bar.featured].map((d) => item(d)) },
      {
        '@type': 'MenuSection',
        name: 'Soft drinks',
        hasMenuItem: bar.soft.map((d) => item({ name: d.name, price: d.price, description: [d.size, d.origin].filter(Boolean).join(', ') })),
      },
    ],
  };
}

export function faqPage(path = '/faq'): Node {
  return {
    '@type': 'FAQPage',
    '@id': absoluteUrl(`${path}#faq`),
    url: absoluteUrl(path),
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.restaurant },
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function parkingHowTo(): Node {
  return {
    '@type': 'HowTo',
    '@id': absoluteUrl('/visit#parking'),
    name: `How to park free and find the door at ${site.name}`,
    description: 'Free validated parking for three hours in a monitored six-level deck on West Peachtree St, then a short walk to the entrance.',
    totalTime: 'PT5M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    step: parkingSteps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
  };
}

export function webPage(path: string, name: string, type = 'WebPage', extra: Node = {}): Node {
  return {
    '@type': type,
    '@id': absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.restaurant },
    inLanguage: 'en-US',
    ...extra,
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: site.name, path: '/' }, ...trail].map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}

export const graph = (...nodes: Node[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
