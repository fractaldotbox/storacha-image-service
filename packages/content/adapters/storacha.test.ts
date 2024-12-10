import {describe, expect, test} from 'vitest';
import path from 'node:path';
import { initStorachaClient } from "./storacha";

const keyString = process.env.VITE_STORACHA_KEY!;
const proofString = process.env.VITE_STORACHA_PROOF!;


describe("storacha", () => {

	test("#initStorachaClient", async () => {

        await initStorachaClient({
            keyString,
            proofString
        })

	});

})