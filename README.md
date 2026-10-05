# The Consulate — website

Next.js 16 (App Router) build of the Consulate redesign prototype. The home page reproduces the prototype; five inner pages, structured data and AI-readable text files are added for search.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploying on Vercel

Import the repo in Vercel (Add New → Project). The framework preset is detected as Next.js, and no settings or `vercel.json` are needed. Every page, share image, `robots.txt`, `sitemap.xml` and `llms.txt` is prerendered at build time.

Concept deploys need no environment variables: canonicals and share images use the deployment's own `*.vercel.app` URL, and the site stays `noindex`.

To launch, set `SITE_LIVE=true` for the Production environment, add the restaurant's domain under Domains, and redeploy.

## Going live

| Variable | Default | Set on production |
| --- | --- | --- |
| `SITE_LIVE` | unset: concept mode | `true` |
| `NEXT_PUBLIC_SITE_URL` | the Vercel deployment URL in concept mode, otherwise `https://www.theconsulateatlanta.com` | the real domain, if different |

**Concept mode** is the default. The site sets `noindex`, `robots.txt` disallows everything, and the footer says "Redesign concept, not the official site". Preview deploys therefore never compete with the restaurant's real listing. Set `SITE_LIVE=true` only on the deploy that replaces theconsulateatlanta.com.

After launch, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Then point the Google Business Profile's website and menu links at `/` and `/menu`.

## Rotating the Visa (every 90 days)

Edit `visa` in `src/content/menu.ts`: country, pin coordinates, `validTo`, `menuAsOf`, `next`, dishes, dessert and cocktails. The following all update from that one object:

- the hero copy and the countdown
- the stamp
- the globe pin
- the share images
- the Menu structured data
- the FAQ answers
- `llms.txt`

The other content files are `site.ts` (hours, address, policies), `story.ts` (room, awards, press) and `faq.ts`.

## Where things are

| Path | What |
| --- | --- |
| `src/content/` | All copy and facts. The pages, schema, OG images and llms.txt read from here |
| `src/components/sections/` | The prototype's scenes, one component each |
| `src/lib/motion/engine.ts` | Scroll-driven motion, ported from the prototype script. Runs on every page |
| `src/lib/globe/scene.ts` | The three.js desk globe, loaded as a separate chunk after the page loads |
| `src/app/map.svg/route.ts` | Flat map shown when WebGL or JavaScript is unavailable |
| `src/lib/schema.ts` | schema.org graph: Restaurant, Menu/MenuItem, FAQPage, HowTo, BreadcrumbList |
| `src/lib/og.tsx` | Share-image renderer: the engraved globe drawn from the same land data |
| `src/lib/llms.ts` | `/llms.txt` and `/llms-full.txt` |
| `src/lib/track.ts` | Analytics events (`reserve_click`, `globe_scene_passed`, `directions_click`, …) sent to GTM or Plausible if installed |

## Search, answer engines and AI assistants

- **Pages:** `/`, `/menu`, `/visit`, `/story`, `/private-dining`, `/faq`. Each has a unique title and description, a canonical URL, an Open Graph image and breadcrumbs.
- **Structured data:**
  - Restaurant: hours, geo, ReserveAction to OpenTable, founders, amenities, awards, `sameAs`
  - Menu: 11 sections, 50 items with prices, diets and origins; Visa items carry `validThrough`
  - FAQPage: 21 answers
  - HowTo: the parking route
- **AI crawlers:** `/llms.txt` and `/llms-full.txt` give a plain-text summary and the full menu. `robots.txt` welcomes AI crawlers by name in live mode.
- **Redirects:** old Squarespace paths redirect permanently: `/eat`, `/drink`, `/where-are-we`, `/gallery`, `/visit-tremont`, `/home`.
- **Performance:** every page is static HTML, and all text is readable without JavaScript. Fonts are self-hosted.

## Fixes made to the prototype

- The rotating rosette made the page 16px wider than the screen on desktop.
- With reduced motion on a phone, the hero text sat on top of the globe.
- There was no fallback without WebGL (requirement M3). It now gets a flat engraved map with the same pins.
- Without JavaScript, the hero beats and itinerary stops were invisible. The server now sends the readable static layout, and a tiny head script upgrades it before first paint.
- The globe's pin label and tap tooltip could run off the right edge.
- The "lines of intent" and the footer passport line failed contrast. Lighthouse accessibility is now 100.
- Added press links (F12), a date on the drinks list (C5), soft drink prices, and crawlable footer links.
- The reservation link now carries OpenTable's `ot_source=Restaurant website` attribution, as the current site's link does.
- three.js went from r128 on a CDN to a current version bundled locally. Colour and light settings keep it pixel-identical to the prototype.

## Still open with the client

These come from the brief's open questions:

- Is Bulgaria on 1 November confirmed?
- Godzilla vs Ebirah is $45 on the site but $47 on OpenTable.
- Jollof rice appears on OpenTable but not on the site.
- Beer, wine and dessert-drink lists only exist as images.
- Photo originals and rights.
- The list of past countries for a passport archive.
- Analytics access.
- Allergen tagging.

Fonts in `assets/fonts/` (used only for share images) are Bodoni Moda and Jost, both under the SIL Open Font License.
