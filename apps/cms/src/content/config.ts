import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// we could point to remote schema too

const httpcat = defineCollection({
    loader: glob({ pattern: "**\/*.json", base: "./src/content/httpcat" }),
    schema: z.object({
      id: z.string(),
      imgSrc: z.string(),
    })
  });
  
export const collections = { httpcat }