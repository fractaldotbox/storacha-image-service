import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

import { generateStorachaSpaceEntries, initStorachaClient } from '@repo/content'
import { HTTP_CAT_PATTERNS_STATIC } from './httpcat/patterns';

// we could point to remote schema too


// fsLoader = glob({ pattern: "**\/*.json", base: "./src/content/httpcat" })



const keyString = process.env.VITE_STORACHA_KEY!;
const proofString = process.env.VITE_STORACHA_PROOF!;

const httpcat = defineCollection({
    loader: async ()=>{

      const {client} = await initStorachaClient({
        keyString,
        proofString
    });

    const {results} =  await client.capability.upload.list({
				cursor: "",
				size: 200,
			});
      console.log("results", results);

      const cids = results.map((r)=>r.root.toString());
      console.log("cids", cids);

      const patterns = [
       ...HTTP_CAT_PATTERNS_STATIC,
        {
          "metadata": "<cid>/metadata.json"
        }
       ];
      const entries = await generateStorachaSpaceEntries(patterns, cids);
      console.log("entries", entries);
      return entries;
    },
    schema: z.object({
      id: z.string(),
      imgSrc: z.string(),
      contentSrc: z.string()
    })
  });
  
export const collections = { httpcat }