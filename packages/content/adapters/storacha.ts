import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { FileLike, ProgressStatus } from "@web3-storage/w3up-client/types";
import type { DownloadProgress } from "ky";

// import * as DID from "@ipld/dag-ucan/did";
import { create } from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

// enable sync methods
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

export type StorachaInitParams = {
	keyString: string;
	proofString: string;
};

export type FileParams<T> = {
	file: T;
	uploadProgressCallback?: (data: DownloadProgress) => void;
};

//@ts-ignore
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

// @w3ui use indexed DB with unextractable `CryptoKey`s.
// https://github.com/storacha/w3ui/blob/main/packages/core/src/index.ts#L69

export const createClient = async (options: any) => {
	const store = new StoreMemory();

	const client = await create({
		...options,
		store,
	});
	return client;
};

export const authWithEmail = async (client: any, email: string) => {
	const account = await client.login(email);

	console.log("account", account);
	return account;
};


export const initStorachaClient = async ({
	keyString,
	proofString,
}: StorachaInitParams) => {
	const principal = Signer.parse(keyString);
	const client = await createClient({
		principal,
	});

	// Add proof that this agent has been delegated capabilities on the space
	const proof = await Proof.parse(proofString!);
	const space = await client.addSpace(proof);

	return {
		client,
		space,
		listFile: async ()=>{

			// client.setCurrentSpace()
			return await client.capability.upload.list({ cursor: '', size: 25 });
		},
		uploadFile: async ({
			file,
			uploadProgressCallback,
		}: FileParams<FileLike>) => {
			const link = await client.uploadFile(file, {
				// fetchWithUploadProgress: async (url, init) => {
				// 	return ky.put(url, {
				// 		...init,
				// 		// custom progress handler not receiving actual progress
				// 		onDownloadProgress: (progress) => {	}
				// 	})
				// },
				onUploadProgress: (progress: ProgressStatus) => {
					uploadProgressCallback?.({
						transferredBytes: progress.loaded,
						totalBytes: progress.total,
						percent: progress.loaded / progress.total,
					});
				},
			});

			// if storacha skip upload for existing file, we need to update proress explicitly
			uploadProgressCallback?.({
				transferredBytes: link.byteLength,
				totalBytes: link.byteLength,
				percent: 1,
			});
			return link;
		},
	};
};

// For hooks refers to w3ui implementation
// https://github.com/storacha/w3ui/blob/835ea5a2a1476e8480354c680535e16a92e6d79d/packages/react/src/hooks.ts
// TODO use jotai for async hooks to init client in wagmi style

export const parseStorachaResults = () => {
	return {
		cid: "",
	};
};
