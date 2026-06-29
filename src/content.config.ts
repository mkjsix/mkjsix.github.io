import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      canonical_url: z.string().optional(),
      image: image().optional(),
      image_alt: z.string().optional(),
      updated: z.coerce.date().optional(),
      noindex: z.boolean().default(false),
    }),
});

export const collections = { blog };
