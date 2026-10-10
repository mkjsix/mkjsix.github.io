import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://maurizioturatti.com',
  output: 'static',
  redirects: {
    '/work-with-me': '/',
    '/blog/2014/10/09/the-brodzinskis-estimation-scale-for': '/writing/',
  },
});
