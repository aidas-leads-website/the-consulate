import { site } from './site';

export const roomPieces: { title: string; text: string; where: string }[] = [
  { title: 'Verner Panton', text: 'Pendant lights', where: 'Denmark' },
  { title: 'Louis Poulsen', text: 'Bar lamps', where: 'Denmark' },
  { title: 'Karl Springer', text: 'Brass “Z” tables', where: 'The lounge' },
  { title: 'Le Corbusier', text: 'LC4 recliner in black leather', where: 'The lounge' },
  { title: 'A queen-sized bed', text: 'Hand-carved solid wood, early 1900s. We rebuilt it into the bar.', where: 'The bar' },
  { title: 'Andy Warhol', text: 'Permanent collection', where: 'The dining room' },
  { title: 'Radcliffe Bailey', text: 'Permanent collection', where: 'The dining room' },
  { title: 'Cleon Peterson', text: 'Permanent collection', where: 'The dining room' },
  { title: 'Ilya Bolotowsky', text: 'Permanent collection', where: 'The dining room' },
  { title: 'Henri Matisse', text: 'Permanent collection', where: 'The dining room' },
  { title: 'The book collection', text: 'Shelves to rival a library, beside the fireplace and the vintage cognac leather sofas', where: 'The lounge' },
];

export const recognition: { title: string; year: string }[] = [
  { title: 'OpenTable Diners’ Choice', year: '2018 to 2025' },
  { title: 'Lee Initiative and Heinz grant recipient', year: '2022' },
  { title: 'James Beard grant recipient', year: '2021' },
  { title: 'Best New Restaurants, Atlanta Journal-Constitution', year: '2017' },
  { title: 'Zagat Top 10 Sexiest New Restaurants and Bars in Atlanta', year: '' },
  {
    title: `${site.ratings.openTable.value} from ${site.ratings.openTable.count.toLocaleString('en-US')} diners on OpenTable`,
    year: site.ratings.openTable.asOf,
  },
];

export const press: { title: string; source: string; year: string; url: string }[] = [
  { title: 'Atlanta’s 12 most gorgeous restaurants', source: 'OpenTable', year: '2026', url: 'https://www.opentable.co.uk/lists/most-beautiful-restaurants-atlanta-16' },
  { title: 'Midtown dining guide', source: 'Eater Atlanta', year: '2026', url: 'https://atlanta.eater.com/maps/best-restaurants-bars-midtown-atlanta' },
  { title: 'Design-forward restaurant bathrooms', source: 'Eater Atlanta', year: '2025', url: 'https://atlanta.eater.com/dining-out-in-atlanta/85339/best-restaurant-restrooms-atlanta' },
  { title: 'Restaurant review', source: 'Atlanta Journal-Constitution', year: '', url: 'http://www.myajc.com/entertainment/dining/review-dining-international-adventure-the-consulate/ZYJYRHcSVTLqZtUcSv2LMM/' },
  { title: 'Five questions for Doug Hines', source: 'Atlanta Homes & Lifestyles', year: '', url: 'http://atlantahomesmag.com/article/5-questions-for-doug-hines/' },
];

export const intentions = [
  'Dishes from all over the world, under one roof.',
  'Somewhere to bring visitors, minus the stiffness.',
  'The wines and spirits other lists overlook.',
  'Detail in the food, the drink and the room.',
  'Art worth looking at. Furniture worth sitting in.',
  'Cocktails made for quality, not speed.',
  'Hidden away, and easy to reach.',
];

