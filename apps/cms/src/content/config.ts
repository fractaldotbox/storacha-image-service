import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import {
	generateStorachaSpaceEntries,
	initStorachaClient,
	loadStorachaConfig,
} from "@repo/content";
import { HTTP_CAT_PATTERNS_STATIC } from "./httpcat";

// fsLoader = glob({ pattern: "**\/*.json", base: "./src/content/httpcat" })

const { keyString, proofString } = loadStorachaConfig();

const httpcat = defineCollection({
	loader: async () => {
		const { client, space } = await initStorachaClient({
			keyString,
			proofString,
		});

		console.log("generate with space", space.name, space.did());

		const { results } = await client.capability.upload.list({
			cursor: "",
			size: 200,
		});

		const cids = results.map((r) => r.root.toString());
		console.log("generate with space cids", cids);

		const patterns = [
			...HTTP_CAT_PATTERNS_STATIC,
			{
				metadata: "<cid>/metadata.json",
			},
		];
		const entries = await generateStorachaSpaceEntries(patterns, cids);
		console.log("entries", entries);
		return entries;
	},
	schema: z.object({
		id: z.string(),
		imageSrc: z.string(),
		contentSrc: z.string(),
	}),
});

export const collections = { httpcat };
