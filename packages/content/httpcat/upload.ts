import { FileLike } from "@web3-storage/w3up-client/types";
import { initStorachaClient, loadStorachaConfig } from "../adapters/storacha";
import { readdirSync, statSync, openAsBlob } from "node:fs";
import { resolve, relative, basename } from "node:path";

import { readDirectoryAsFiles } from "../adapters/fs";

const config = loadStorachaConfig();
const { client } = await initStorachaClient(config);

export const uploadHttpcat = async () => {
	// we could upload with wrapped directory or by batch of files
	// TBC confirm limits

	const directory = resolve(__dirname, "./raw");

	const files = await readDirectoryAsFiles(directory);

	const uploadCid = await client.uploadDirectory(files, {});

	console.log("results", uploadCid.toString());
	const cidString = uploadCid.toString();

	const list = files
		.map((file) => {
			if (file.name.match(/md/)) {
				const id = file.name.replace(".md", "");
				return {
					id,
					contentSrc: `${cidString}/${id}.md`,
					imageSrc: `${cidString}/${id}.jpg`,
				};
			}
		})
		.filter((entry) => entry?.id);

	console.log(list);
};

export const uploadHttpcatExtra = async () => {
	const directory = resolve(__dirname, "./extra");

	const files = await readDirectoryAsFiles(directory);

	const results = await client.uploadDirectory(files, {});

	console.log("results", results);
};

await uploadHttpcat();

await uploadHttpcatExtra();
