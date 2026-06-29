# maurizioturatti.com

Personal website for Maurizio Turatti, focused on software architecture, backend systems, AI integration, and technical leadership.

Built with [Astro](https://astro.build) as a static site.

## Live site

- https://maurizioturatti.com

## Tech stack

- Astro 7
- TypeScript support
- Astro Content Collections for writing posts
- Static output (`dist/`)

## Main routes

- `/` - Home page (positioning, experience, and contact CTA)
- `/writing` - Article index
- `/writing/[slug]` - Individual article page

## Writing workflow

Posts live in `src/content/blog/*.md` and are validated by the schema in `src/content.config.ts`.

Required frontmatter fields:

- `title`
- `description`
- `date`
- `tags` (optional, defaults to `[]`)
- `draft` (optional, defaults to `false`)
- `canonical_url` (optional)

Only posts with `draft: false` are listed in `/writing`.

## Local development

Requirements:

- Node.js >= 22.12.0

Install and run:

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Build and preview

```bash
npm run build
npm run preview
```

Production files are generated in `dist/`.

## Deployment notes

- The project is configured as a static Astro site (`output: 'static'`).
- Canonical site URL is set in `astro.config.mjs`.
- Custom domain is configured via `public/CNAME`.
