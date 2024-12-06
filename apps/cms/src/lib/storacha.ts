import * as Client from '@web3-storage/w3up-client';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';
import * as Proof from '@web3-storage/w3up-client/proof';
import { Signer } from '@web3-storage/w3up-client/principal/ed25519';
import * as DID from '@ipld/dag-ucan/did';
import type { ServiceAbility } from '@web3-storage/w3up-client/types';


export const createClientWithSpace = async ({
    keyString,
    proofString
}:{
    keyString: string;
    proofString: string;
})=>{
    
    const principal = Signer.parse(keyString)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    const proof = await Proof.parse(proofString)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did());

    return client;
}

export const createDelegation = async ({
    did,
    keyString,
    proofString
}:{
    did:string,
    keyString: string;
    proofString: string;
})=>{

    const client = await createClientWithSpace({
        keyString,
        proofString
    });
    // Create a delegation for a specific DID
    const audience = DID.parse(did)
    const abilities = ['space/blob/add', 'space/index/add', 'filecoin/offer', 'upload/add'] as ServiceAbility[]
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours from now
    const delegation = await client.createDelegation(audience, abilities, { expiration })

    // Serialize the delegation and send it to the client
    const archive = await delegation.archive()
    return archive.ok
}