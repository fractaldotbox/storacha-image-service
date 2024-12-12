import path from "node:path";
import { describe, expect, test } from "vitest";
import { readDirectoryAsFiles } from "./fs";

describe("fs", () => {
	test("#readDirectoryAsFiles", async () => {
		const address = "0x962EFc5A602f655060ed83BB657Afb6cc4b5883F";

		const directory = path.resolve(__dirname, ".");
		const files = await readDirectoryAsFiles(directory);

		expect(files.length).toBe(3);
		expect(files[0].name).toBe("fs.test.ts");
	});
});
