import type { MetadataRoute } from 'next';
import { absoluteUrl, site } from '@/content/site';

// AI answer engines are welcomed by name so their crawlers can quote menus, hours and directions.
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'meta-externalagent', 'Amazonbot'];

export default function robots(): MetadataRoute.Robots {
  if (!site.live) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
