import type { Metadata } from 'next';
import { site } from '@/content/site';

/** Per-page metadata: unique title and description, canonical URL and Open Graph (C1, S2). */
export function pageMeta({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: site.name, locale: 'en_US', url: path, title: fullTitle, description },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}
