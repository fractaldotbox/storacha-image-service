// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
	integrations: [
		react({
			experimentalReactChildren: true,
		}),
		tailwind({
			applyBaseStyles: true,
		}),
	],

	adapter: cloudflare(),
});
