// Menus. To rotate the Visa, change `visa` below (country, pin, dates, dishes, cocktails).
// Page copy, the stamp, the globe pin, structured data and llms.txt all follow from it.

export type Diet = 'vegan' | 'vegetarian' | 'gluten-free';

export type Dish = {
  name: string;
  price?: number;
  description: string;
  note?: string;
  diet?: Diet[];
};

export type Place = { name: string; lat: number; lon: number };

export type StandingDish = Dish & { origin: string; section: SectionKey };

export type SectionKey = 'snacks-for-the-table' | 'vegetarian' | 'meat' | 'seafood' | 'executive-plates' | 'dessert';

// ---------- The Visa: the rotating menu the globe chose ----------
export const visa = {
  country: 'Vietnam',
  // Pin position on the globe (country centroid, not the capital).
  lat: 16.2,
  lon: 107.6,
  validTo: '2026-10-31',
  menuAsOf: '2026-10-05',
  next: { country: 'Bulgaria', from: '2026-11-01', lat: 42.7, lon: 25.3 },
  dishes: [
    { name: 'Green Mekong Papaya Salad', price: 25, description: 'Two jumbo prawns, mango, jicama, mint and cilantro in a pineapple-lemon vinaigrette, with crushed peanuts and crispy shallots.' },
    { name: 'Papaya Salad with vegan “scallops”', price: 22, description: 'The same salad with king oyster mushroom in place of the prawns.', diet: ['vegan'] },
    { name: 'Bánh Bột Lọc Trio', price: 23, description: 'Tapioca dumplings with roasted butternut squash, tofu and wood ear mushroom. Black vinegar dumpling sauce.' },
    { name: 'Da Nang Noodles', price: 24, description: 'Stir-fried lemongrass vegetables, vegan scallops and tofu over garlic butter rice noodles, with herbs, roasted peanuts and chili.' },
    { name: 'The Dong Khoi DeLuxe', price: 52, description: 'Lobster tail bánh mì: crispy seasoned lobster tail, lemongrass coconut aioli, culantro, pickled vegetables and lotus root chips.' },
    { name: 'Lemongrass & Basil Snails', price: 26, description: 'Eight snails with lemongrass, basil, lime leaf, garlic, ginger, fish sauce and coconut milk.' },
    { name: 'Phở bò', price: 45, description: 'Beef short rib pho with a seasoned beef meatball, rice noodles, herbs, bean sprouts and crispy garlic chili oil.', note: 'The national dish' },
    { name: 'Bò Lá Lốt', price: 32, description: 'Four pan-seared scallops with betel leaf, mango coconut cream sauce, roasted peanuts, toasted coconut and flying fish roe.' },
    { name: 'Sapa Night Market Braised Crispy Duck', price: 32, description: 'Orange hoisin glazed duck quarter with star anise and cloves. Green papaya, jicama and pickled daikon slaw.' },
    { name: 'Cha Ca La Vong', price: 32, description: 'Pan-fried catfish with turmeric, garlic, ginger, fresh dill and scallion over garlic butter rice noodles.', note: 'The legendary dish of Hanoi' },
    { name: 'Thit Kho To', price: 35, description: 'Slow-braised pork belly in coconut water and fish sauce with ginger and star anise, Shanghai baby bok choy and a fried egg.' },
    { name: 'Ho Chi Minh Bún Chả', price: 30, description: 'Charred grilled pork and slow-cooked lemongrass ginger pork belly with rice noodles, fresh herbs, nước chấm and pickled radish.' },
  ] as Dish[],
  desserts: [
    { name: 'Che Suong Sa Hat Luu', price: 14, description: 'Coconut and pineapple sorbet with lychee, mango, dragon fruit, pandan and lychee jellies, strawberry pearls and coconut cream. Add Midori for $2.' },
  ] as Dish[],
  cocktailPrice: 16,
  cocktails: [
    { name: 'Pho Nhaum', description: 'Gin blend, aquavit, Basque vermouth, pho spices, onion, fish sauce.' },
    { name: 'Fog Over Saigon River', description: 'Volcanic rum, Vietnamese dry gin, Poire Williams, orgeat, pandan, vermouth, sherry.' },
    { name: 'Kissy Suzuki', description: 'Cucumber watermelon mint gin, shochu, pisco, French melon, pineapple, alpine herbs.' },
    { name: 'Colonel Sun', description: 'Organic cognac, spiced pear, mango eau de vie, crémant.' },
  ] as Dish[],
};

// ---------- The standing menu ----------
export const sections: { key: SectionKey; label: string }[] = [
  { key: 'snacks-for-the-table', label: 'Snacks for the table' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'meat', label: 'Meat' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'executive-plates', label: 'Executive plates' },
  { key: 'dessert', label: 'Dessert' },
];

export const standingAsOf = '2026-10-05';

export const standing: StandingDish[] = [
  { section: 'snacks-for-the-table', origin: 'Ireland', name: 'Munster Mini’s', price: 16, description: 'Five crispy fried mashed potato balls with onions and mushrooms, balsamic glaze and Worcestershire truffle aioli.' },
  { section: 'snacks-for-the-table', origin: 'Korea', name: 'Korean BBQ Duck Confit', price: 24, description: 'Pulled duck with butternut squash, dried cranberries and Korean barbecue sauce. Toasted pita points.' },
  { section: 'snacks-for-the-table', origin: 'Cuba', name: 'The Havana Egg Roll', price: 20, description: 'Ten-hour roasted pork, honey ham, asiago and mojo mustard, with a pickle spear.' },
  { section: 'snacks-for-the-table', origin: 'Global', name: 'The King’s Ransom Charcuterie Board', price: 30, description: 'Seasonal meats and cheeses, nuts, housemade jam, olives, fresh fruit and toasted pita points.' },
  { section: 'snacks-for-the-table', origin: 'Egypt', name: 'Zamalek District Hummus', price: 18, description: 'Fava bean hummus with tahini, pine nuts and trumpet mushrooms. Pita points, cucumber and carrot.' },
  { section: 'vegetarian', origin: 'China', name: 'Sautéed String Beans', price: 16, description: 'Crispy shallots in a garlic and ginger sauce.', diet: ['vegetarian'] },
  { section: 'vegetarian', origin: 'Thailand', name: 'Chef Lin’s Signature Sautéed Okra', price: 16, description: 'Cracked pepper, rosemary and Thai chili sauce.', diet: ['vegetarian'] },
  { section: 'vegetarian', origin: 'Jamaica', name: 'Jerk Mushroom Yasso', price: 27, description: 'Oyster, shiitake and king mushrooms in a parmesan cream sauce over udon. Add four shrimp for $12 or chicken for $7.', diet: ['vegetarian'] },
  { section: 'vegetarian', origin: 'New York City', name: 'Impossible Brooklyn Irishman Chop Cheese', price: 27, description: 'Eight ounces of Impossible meat with potato, caramelized onions, Irish cheddar and truffle Worcestershire aioli on a hero roll.', diet: ['vegetarian'] },
  { section: 'meat', origin: 'Ethiopia', name: 'Lamb Tibs', price: 28, description: 'Dry-sautéed lamb with onions, berbere, rosemary, jalapeño, garlic and ginger. White rice.' },
  { section: 'meat', origin: 'Korea', name: 'Black Truffle Bulgogi', price: 38, description: 'Sliced prime ribeye in a pear, brown sugar and soju reduction over squid ink pasta with black truffle oil.' },
  { section: 'meat', origin: 'New York City', name: 'The Brooklyn Irishman ChopCheese', price: 27, description: 'Eight ounces of grass-fed Angus beef with potato, caramelized onions, Irish cheddar and Cooper Sharp on a hero roll.' },
  { section: 'meat', origin: 'Singapore', name: 'Queenstown Char Siu Chicken', price: 34, description: 'Deboned halal chicken quarters glazed with soy, brown sugar and ginger, with caramelized onions.' },
  { section: 'meat', origin: 'Cambodia', name: 'Battambang Market Ribs', price: 35, description: 'Twenty-spice, slow-cooked Khmer barbecued pork ribs with a seasoned chili vinegar dip.' },
  { section: 'seafood', origin: 'Japan', name: 'Godzilla vs Ebirah', price: 45, description: 'Knife-cut flat egg noodles with eight ounces of cubed lobster tail, garlic, sake, miso, red tobiko and bonito.' },
  { section: 'seafood', origin: 'Galápagos', name: 'Arroz Con Mariscos', price: 48, description: 'Calamari, shrimp, scallops and half a lobster tail over seasoned yellow rice with a spicy aioli drizzle.' },
  { section: 'seafood', origin: 'Singapore', name: 'Serangoon Gardens Soft Shell Chili Crab', price: 38, description: 'Stir-fried soft shell crabs in sambal chili sauce with lime leaf, cilantro and egg. Fried bao buns.' },
  { section: 'seafood', origin: 'Singapore', name: 'Mai Pian Xia (Cereal Prawns)', price: 35, description: 'Six fried jumbo prawns tossed with toasted oats and rice cereal, curry leaves and red chili.' },
  { section: 'executive-plates', origin: 'Turkey', name: 'Turkish Şili Levrek', price: 52, description: 'Pistachio-crusted, pan-seared wild Chilean sea bass with an apricot chili glaze on seasoned couscous.' },
  { section: 'executive-plates', origin: 'Egypt', name: 'The Pharaoh’s Share', price: 39, description: 'Slow-braised lamb shank with ginger, cardamom, cinnamon and cumin over herb garlic mashed potatoes.' },
  { section: 'dessert', origin: 'Turkey', name: 'Turkish Coffee Cheesecake', price: 8, description: 'Crushed pistachios and an orange liqueur glaze.' },
];

// The itinerary: the places on the standing menu, flown west to east.
// Each stop lists its dishes in this order (names must match `standing`).
export const home: Place & { label: string; info: string } = {
  name: 'Atlanta',
  lat: 33.7817,
  lon: -84.3871,
  label: 'Departing 10th Street, Atlanta',
  info: 'The Consulate, 10 10th St NW',
};

export const itinerary: (Place & { dishes: string[] })[] = [
  { name: 'New York City', lat: 40.68, lon: -73.94, dishes: ['Impossible Brooklyn Irishman Chop Cheese', 'The Brooklyn Irishman ChopCheese'] },
  { name: 'Cuba', lat: 23.11, lon: -82.37, dishes: ['The Havana Egg Roll'] },
  { name: 'Jamaica', lat: 18, lon: -76.8, dishes: ['Jerk Mushroom Yasso'] },
  { name: 'Galápagos', lat: -0.74, lon: -90.31, dishes: ['Arroz Con Mariscos'] },
  { name: 'Ireland', lat: 52, lon: -8.6, dishes: ['Munster Mini’s'] },
  { name: 'Turkey', lat: 41, lon: 29, dishes: ['Turkish Şili Levrek', 'Turkish Coffee Cheesecake'] },
  { name: 'Egypt', lat: 30.06, lon: 31.22, dishes: ['The Pharaoh’s Share', 'Zamalek District Hummus'] },
  { name: 'Ethiopia', lat: 9.03, lon: 38.74, dishes: ['Lamb Tibs'] },
  { name: 'Thailand', lat: 13.75, lon: 100.5, dishes: ['Chef Lin’s Signature Sautéed Okra'] },
  { name: 'Cambodia', lat: 13.1, lon: 103.2, dishes: ['Battambang Market Ribs'] },
  { name: 'Singapore', lat: 1.35, lon: 103.82, dishes: ['Queenstown Char Siu Chicken', 'Serangoon Gardens Soft Shell Chili Crab', 'Mai Pian Xia (Cereal Prawns)'] },
  { name: 'China', lat: 34.5, lon: 108.9, dishes: ['Sautéed String Beans'] },
  { name: 'Korea', lat: 37.57, lon: 126.98, dishes: ['Korean BBQ Duck Confit', 'Black Truffle Bulgogi'] },
  { name: 'Japan', lat: 35.68, lon: 139.69, dishes: ['Godzilla vs Ebirah'] },
];

export const dishByName = (name: string) => {
  const d = standing.find((x) => x.name === name);
  if (!d) throw new Error(`Itinerary dish not on the standing menu: ${name}`);
  return d;
};

// ---------- The bar ----------
export const bar = {
  asOf: '2026-10-05',
  director: 'Josh Wheeler',
  resident: [
    { name: 'The Consulate Elixir', price: 18, description: 'A reconstructed Old-Fashioned: Four Roses bourbon, crème de pêche, mint, three bitters, citrus oils.' },
    { name: 'Oddjobs Punch', price: 16, description: 'Four Roses bourbon, lemongrass ginger syrup, lemon, China-China, St-Germain.' },
    { name: 'Pam Bouvier', price: 16, description: 'Vietnamese gin, vodka, thistle, lychee, pineapple, cherry.' },
  ] as Dish[],
  featured: {
    name: 'Moroccan Sunset',
    price: 18,
    description:
      'Mahia, passion fruit liqueur, orange and lemon over one large cube of late-bottled vintage port. As the cube melts, the drink sets like the evening sun and becomes a different cocktail. Limited quantities nightly.',
  } as Dish,
  soft: [
    { name: 'D&G Ginger Beer', origin: 'Jamaica', size: '12 oz', price: 6 },
    { name: 'Fever-Tree Ginger Ale', origin: 'USA', size: '8 oz', price: 5 },
    { name: 'Coca-Cola or Sprite, cane sugar, glass bottle', origin: 'Mexico', size: '12 oz', price: 7 },
    { name: 'Diet Coke', origin: 'USA', size: '8 oz', price: 5 },
    { name: 'GingrPure ginger juice by Honey Bubble', origin: 'Vietnam', size: '10.5 oz', price: 4 },
    { name: 'GingrPure Lemonade', origin: '', size: '12 oz', price: 6 },
    { name: 'Jia Duo Bao herbal sweet tea', origin: 'China', size: '10.4 oz', price: 4 },
    { name: 'Voss water, still or sparkling', origin: 'Norway', size: '28 oz', price: 11 },
  ],
};
