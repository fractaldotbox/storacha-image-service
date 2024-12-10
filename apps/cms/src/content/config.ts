import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

import { initStorachaClient } from '@repo/content'

// we could point to remote schema too


// fsLoader = glob({ pattern: "**\/*.json", base: "./src/content/httpcat" })


/**
 * Goal is to support a dynamic list of images & content (.md) including end-user upload.
 * 
 * 
 * At storacha, convention is required to avoid a separated stored index for following reasons.
 * It is possible to list cids in a space, however we cannot tell if a cid is a wrapped directory and its file type
 * At best we have to stream it to determine file type with magic bytes
 * Ref: https://discuss.ipfs.tech/t/how-to-know-what-type-of-file-a-cid-represents/16007/2
 * 
 * (As of today seems no programmatic way to list dir contents via gateway / sdk as well )
 * https://discuss.ipfs.tech/t/how-to-get-content-of-an-ipfs-folder-as-json/16912
 * 
 * At the end of the day we still have to parse content of an extra file to determine the id and other metadata
 *
 * Thus for each space we support entries of
 * - explicitly specified full ipfs path 
 * - pattern of wildcard <cid> marker for wrapped directory
 *   - metadata.json file where contents populate the result entry (e.g. it contains id)
 *   - relative path inside fields of metadata json will be expanded after cid is determined
 * 
 * e.g.
 * [
 *  {
 *    "id": "100",
 *    "imageSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.png",
 *    "contentSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.md"
 *  },
 *  {
 *    "id": "101",
 *    "imageSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.png",
 *    "contentSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.md"
 *  },
 *  {
 *    "metadata": "<cid>/metadata.json"
 *  }
 * ]
 * 
 * where metadata.json contains
 * {
 *   "id": "999",
 *   "imageSrc": "./999.md",
 *   "contentSrc": "./999.md"
 * }
 * 
 * 
 * For alternatives,
 * - non decentralized options
 *   - could use cloudflare KV etc
 * - decentralized options
 *   - consider ENS
 * 
 */

type EntryPattern = {
  imageSrc: string,
  contentSrc: string
}

const parseMetadata = async ()=>{
  const text = await fetch('https://ipfs.io/ipfs/bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.md')
  .then(response => response.json())

  return text;

}


const generateStorachaSpaceEntries = async (patterns: EntryPattern[], entry: any)=>{

  
};

const keyString = process.env.VITE_STORACHA_KEY!;
const proofString = process.env.VITE_STORACHA_PROOF!;

const httpcat = defineCollection({
    loader: async ()=>{

      const {client} = await initStorachaClient({
        keyString,
        proofString
    });

    const results =       await client.capability.upload.list({
				cursor: "",
				// cursor: "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua",
				size: 1,
			});

      console.log('results', results);

      const parsed = await parse();
      console.log('parsed', parsed);

      return [];
    },
    schema: z.object({
      id: z.string(),
      imgSrc: z.string(),
      contentSrc: z.string()
    })
  });
  
export const collections = { httpcat }