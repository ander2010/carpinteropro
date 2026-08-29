import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const sitemapUrl = new URL('sitemap-index.xml', site ?? 'https://carpinteropro.com').toString();

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
