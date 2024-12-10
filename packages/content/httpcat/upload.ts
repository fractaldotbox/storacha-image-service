import { FileLike } from '@web3-storage/w3up-client/types';
import {initStorachaClient} from '../adapters/storacha'
import { readdirSync, statSync, openAsBlob} from 'node:fs';
import {resolve, relative, basename} from 'node:path';

import { readDirectoryAsFiles } from '../adapters/fs';


const keyString = process.env.VITE_STORACHA_KEY!;
const proofString = process.env.VITE_STORACHA_PROOF!;

const config = {
    keyString,
    proofString
}
const { client } = await initStorachaClient(config);


export const uploadHttpcat =  async ()=>{

    // we could upload with wrapped directory or by batch of files
    // TBC confirm limits

    const directory = resolve(__dirname, './raw')
    
    const files = await readDirectoryAsFiles(directory);
    
    const results = await client.uploadDirectory(files, {});

    console.log('results', results)
}

export const uploadHttpcatExtra =  async ()=>{

    const directory = resolve(__dirname, './extra')
    
    const files = await readDirectoryAsFiles(directory);

    
    const results = await client.uploadDirectory(files, {});

    console.log('results', results)

}

// await uploadHttpcat();

await uploadHttpcatExtra();


