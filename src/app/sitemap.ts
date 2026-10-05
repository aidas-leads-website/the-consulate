import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/content/site';
import { bar, standingAsOf, visa } from '@/content/menu';

const latest = [visa.menuAsOf, standingAsOf, bar.asOf].sort().at(-1)!;

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly', lastModified = latest) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    images: [absoluteUrl(`${path === '/' ? '' : path}/opengraph-image`)],
  });
  return [
    page('/', 1, 'weekly'),
    page('/menu', 0.9, 'weekly'),
    page('/visit', 0.8, 'monthly'),
    page('/faq', 0.7, 'monthly'),
    page('/private-dining', 0.6, 'monthly'),
    page('/story', 0.6, 'monthly'),
  ];
}
