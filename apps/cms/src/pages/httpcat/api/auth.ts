export const prerender = false;

import {
	createDelegation,
	initStorachaClient,
	loadStorachaConfig,
} from "@repo/content";
import type { APIRoute } from "astro";

/**
 * Create delegation for user
 *
 * @returns
 */
export const GET: APIRoute = async (config) => {
	const { params, request, url } = config;
	const did = url.searchParams.get("did");

	if (!did) {
		return new Response("Missing DID", {
			status: 500,
		});
	}
	const { keyString, proofString } = loadStorachaConfig();

	const { client, space } = await initStorachaClient({
		keyString,
		proofString,
	});

	const delegationResults = await createDelegation(
		{
			client,
			spaceDid: space.did(),
		},
		{
			userDid: did,
		},
	);

	return new Response(delegationResults, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
