import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Jost } from 'next/font/google';
import { site } from '@/content/site';
import { visa } from '@/content/menu';
import { JsonLd } from '@/components/JsonLd';
import { graph, restaurant, website } from '@/lib/schema';
import './globals.css';

// Self-hosted by next/font: no render-blocking request to Google (P1).
// Only the Latin files are preloaded; Latin Extended (Ş, ả…) loads on demand via unicode-range.
// Bodoni Moda is only ever set in italic; the optical-size axis gives the hairlines at display sizes.
const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['italic'], axes: ['opsz'], variable: '--font-bodoni', display: 'swap' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });

const description = `Every 90 days a guest spins the globe and Chef Mei Lin cooks wherever it stops. Now serving ${visa.country}. Dinner Tuesday to Saturday in Midtown Atlanta.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Global cuisine and cocktails, Midtown Atlanta`, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  category: 'restaurant',
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  // Concept builds stay out of every index; the production deploy sets SITE_LIVE=true.
  robots: site.live
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
    : { index: false, follow: false },
  other: {
    'geo.region': 'US-GA',
    'geo.placename': 'Atlanta',
    'geo.position': `${site.geo.lat};${site.geo.lon}`,
    ICBM: `${site.geo.lat}, ${site.geo.lon}`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0E2A23',
};

// Runs before first paint. The server sends the static, no-WebGL layout (readable without
// JavaScript, M4); this switches to the scroll-driven globe when the browser can draw it and
// the visitor has not asked for reduced motion (M2, M3). It must stay tiny and synchronous.
const MODE = `(function(c){try{c.remove('no-js');if('WebGL2RenderingContext' in window){c.remove('no-gl');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)c.remove('static')}}catch(e){}})(document.documentElement.classList)`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`no-js static no-gl ${bodoni.variable} ${jost.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Plain-text summary for AI assistants" />
      </head>
      <body>
        {children}
        <JsonLd data={graph(restaurant(), website())} />
      </body>
    </html>
  );
}
