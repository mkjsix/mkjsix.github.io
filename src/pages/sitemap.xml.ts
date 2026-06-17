import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const toLastModDate = (date: Date) => date.toISOString().slice(0, 10);

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const base = (import.meta.env.SITE || 'https://maurizioturatti.com').replace(/\/$/, '');
  const buildDate = toLastModDate(new Date());

  const staticPages = [
    { path: '/', lastmod: buildDate },
    { path: '/about/', lastmod: buildDate },
    { path: '/work-with-me/', lastmod: buildDate },
    { path: '/writing/', lastmod: buildDate },
  ];

  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const postPages = posts.map((post) => ({
    path: `/writing/${post.id.replace(/\.md$/, '')}/`,
    lastmod: toLastModDate(post.data.updated ?? post.data.date),
  }));

  const urls = [...staticPages, ...postPages]
    .map(
      (entry) =>
        `<url><loc>${escapeXml(`${base}${entry.path}`)}</loc><lastmod>${entry.lastmod}</lastmod></url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
