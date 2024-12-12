import { openAsBlob, readdirSync, statSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import { FileLike } from "@web3-storage/w3up-client/types";

interface FileInfo {
	path: string;
	relativePath: string;
	size: number;
}

async function* getFiles(
	dir: string,
	baseDir: string,
): AsyncGenerator<FileInfo> {
	const dirents = await readdirSync(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const fullPath = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(fullPath, baseDir);
		} else {
			const stats = await statSync(fullPath);
			const relativePath = relative(baseDir, fullPath);
			yield {
				path: fullPath,
				relativePath,
				size: stats.size,
			};
		}
	}
}

/**
 * bridge gap for nodejs and Web MDN File interface for v22+
 */

export const readDirectoryAsFiles = async (directory: string) => {
	let files: FileLike[] = [];
	for await (const file of getFiles(directory, directory)) {
		// experimental node api
		const blob = await openAsBlob(file.path);
		const fileName = basename(file.path);
		//@ts-ignore
		blob.name = fileName;
		files.push(blob as unknown as FileLike);
	}

	console.log("files", files.length);

	return files;
};
