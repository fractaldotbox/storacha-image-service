/**
 * Goal is to support a dynamic list of images & content (.md) including end-user upload.
 * Such list (index) could be consumed at astro to generate static sites
 *
 * At storacha, convention is applied to build index from source of truth to avoid
 * maintaining and storing it for following reasons.
 *
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

export type EntryPattern = {
	metadata?: string;
	imageSrc?: string;
	contentSrc?: string;
};

const fetechMetadata = async (filePathWithCid: string) => {
	const gateway = "https://ipfs.io/ipfs/";
	try {
		const metadata = await fetch(gateway + filePathWithCid).then((response) =>
			response.json(),
		);

		return metadata;
	} catch (error) {
		console.error("error fetching metadata", filePathWithCid, error);
	} finally {
		return {};
	}
};

async function* generateWithPattern(
	pattern: EntryPattern,
	cid: string,
): AsyncGenerator<any> {
	if (!pattern.metadata) {
		throw new Error("metadata is required");
	}

	const filePathWithCid = pattern.metadata.replace("<cid>", cid);
	console.log("fetch metadata", filePathWithCid);
	const metadata = await fetechMetadata(filePathWithCid);

	console.log("metadata", metadata);

	// TODO support other fields

	if (metadata.id) {
		yield {
			...metadata,
			imageSrc: (metadata.imageSrc || "").replace("./", `${cid}/`),
			contentSrc: (metadata.contentSrc || "").replace("./", `${cid}/`),
		};
	}
}

export const generateStorachaSpaceEntries = async (
	patterns: EntryPattern[],
	cids: any[],
) => {
	const entries: any = [];

	const cidsExcluded = cids.filter(
		(cid) => !patterns.find((pattern) => (pattern.imageSrc || "").match(cid)),
	);

	for (const pattern of patterns) {
		if (pattern.metadata) {
			console.log("generate with excluded cids", cidsExcluded);
			for (const cid of cidsExcluded) {
				for await (const entry of generateWithPattern(pattern, cid)) {
					console.log("entry", entry);
					entries.push(entry);
				}
			}
		} else {
			entries.push(pattern);
		}
	}

	return entries;
};
