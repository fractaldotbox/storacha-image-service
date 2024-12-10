import {describe, expect, test} from 'vitest';
import { generateStorachaSpaceEntries } from './entry';

describe("generate patterns", () => {
    const patterns = [
        {
          "id": "100",
          "imageSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.png",
          "contentSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.md"
        },
        {
          "id": "101",
          "imageSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.png",
          "contentSrc": "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.md"
        },
        {
          "metadata": "<cid>/metadata.json"
        }
       ];

    const cids = [
        "bafybeid6jwaslutkti3hl4tflfwn4mkzqz3lld2rz7xoainn7u4sfhck5y",
        "bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua"
    ]
       

  test('#generateStorachaSpaceEntries with corrupted entries ', async () => {
    // TODO
  });

	test("#generateStorachaSpaceEntries", async () => {
        const entries = await generateStorachaSpaceEntries(patterns, cids);

        console.log('entries', entries);
        
        expect(entries).toEqual([
          {
            id: '100',
            imageSrc: 'bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.png',
            contentSrc: 'bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/100.md'
          },
          {
            id: '101',
            imageSrc: 'bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.png',
            contentSrc: 'bafybeifpiqvtu3tpmqtefd7dpx2dkcjorfwwn3mdhpqpb3egmbthjr57ua/101.md'
          },
          {
            id: '999',
            imageSrc: 'bafybeid6jwaslutkti3hl4tflfwn4mkzqz3lld2rz7xoainn7u4sfhck5y/999.md',
            contentSrc: 'bafybeid6jwaslutkti3hl4tflfwn4mkzqz3lld2rz7xoainn7u4sfhck5y/999.md'
          }
        ])
	});

}, 5 * 60 * 1000);