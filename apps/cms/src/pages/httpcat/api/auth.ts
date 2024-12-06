import { createDelegation } from '@/lib/storacha';
import type { APIRoute } from 'astro';

// VITE_STORACHA_DID
const keyString = process.env.VITE_STORACHA_KEY!;
const proofString = process.env.VITE_STORACHA_PROOF!;

export const GET: APIRoute =  async ({ params, request }) => {
  const did = 'did:key:z6MkgEPYy8gDw5QNsmDwh8rHjQHaBvUoh9x6pGayS99dTaAY';

  const clientConfig = {
     keyString,
     proofString
  }

  console.log('clientConfig',clientConfig);

  const delegationResults = await createDelegation({
    did,
    ...clientConfig
  });


  
  console.log('results',delegationResults)
  
    return new Response(delegationResults,{
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
}
  
export const POST: APIRoute = ({ request }) => {
return new Response(JSON.stringify({
    message: "This was a POST!"
    })
)
}

export const DELETE: APIRoute = ({ request }) => {
return new Response(JSON.stringify({
    message: "This was a DELETE!"
    })
)
}

export const ALL: APIRoute = ({ request }) => {
return new Response(JSON.stringify({
    message: `This was a ${request.method}!`
    })
)
}