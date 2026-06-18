# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project at a glance

- Stack: Astro 6, TypeScript-enabled, static output.
- Runtime requirement: Node.js >= 22.12.0.
- Main routes:
  - `/` in `src/pages/index.astro`
  - `/work-with-me` in `src/pages/work-with-me.astro`
  - `/writing` in `src/pages/writing/index.astro`
  - `/writing/[slug]` in `src/pages/writing/[slug].astro`

See `README.md` for high-level project info.

## Commands agents should run

- Install: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

## Content and routing conventions

- Blog posts live in `src/content/blog/*.md`.
- Content schema is defined in `src/content.config.ts`.
- Required frontmatter: `title`, `description`, `date`.
- Optional frontmatter: `tags`, `draft`, `canonical_url`.
- `draft: true` posts are filtered out from both writing index and static paths.
- Slugs are generated from content file IDs by removing `.md`.

When changing post fields, update both markdown content and `src/content.config.ts` together.

## Styling and layout conventions

- Shared page shell is `src/layouts/Base.astro`.
- Global stylesheet is `src/styles/global.css`, imported by `src/layouts/Base.astro` (Vite-hashed on build).
- Keep existing visual language and typography unless a change request explicitly asks for a redesign.

## Editing guidance

- Prefer minimal, targeted edits; avoid broad refactors.
- Preserve existing Astro + TypeScript style in each file (quote style and formatting may differ by file).
- For navigation, metadata, and shared head/body structure, modify `src/layouts/Base.astro`.
- For writing list behavior, modify `src/pages/writing/index.astro`.
- For writing page generation/rendering behavior, modify `src/pages/writing/[slug].astro`.

## Validation checklist before finishing

- Run `npm run build` after structural/template/content-collection changes.
- If touching writing pages, verify draft filtering still works.
- If touching global styles, verify the edited file is the one actually loaded by the layout.