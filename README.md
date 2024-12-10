# Storacha Image Service

# Motiviations

Often we need performant and flexible image service, from avatar to placeholders.
Applying Generative AI is great but we need cost effective storage with fast (cached) retrieval

For best of both worlds, this is a micro CMS to store asasets on filecoin (via storacha), host static sites with API & optimized retrieval urls and welcome end-user to contribute in a decentralized way 

This is a project to demo
- storacha's UCAN supporting [Delegated upload flow](https://docs.storacha.network/concepts/architecture-options/#delegated)
- setup static sites and API with retrieval of assets on filecoin 


## Deployment targets
- Cloudflare pages
  - Opt for wrangler as we want to incorp multiple projects in this repo
  - use env variables on .env for auth
  - `env-cmd pnpm --filter cms deploy`
- Fleek (TODO)

## Uploading Assets (Bootstrap)
- we opt for supporting dynamic content on unopinionated date source and gateway (instead of relying astro to serve static assets from where site is deployed).
- Thus we decoupled content upload step
- run `env-cmd pnpm --filter content upload:httpcat`
- https://ipfs.io/ipfs/bafybeieedes5ltapehw3z3svjf5oty5v4r54rdaf54nq5d62m67nhl3aw4

## Architecture
- Delegated approach

- Astro (5.0) to export a static sites, consist of
  - image showcase
  - upload page

- use w3ui/react in single component for now and separate static vs upload page (auth requires)
- switch to jotai for client state
  - https://docs.astro.build/en/recipes/sharing-state-islands/

## Demo projects

### HttpCat
- Demo where static contnet is stored under content 


## Reference use cases

### Placeholder services
- https://dummyimage.com/
- https://placecats.com/
- https://doodleipsum.com/

### Avatar
- Avatar, Status Code, Tokens


# Acknolwedgement

## HTTPCat
- Developed by @rogeriopvl
- Original Images by Tomomi Imura (@girlie_mac)
- [HttpCat to Web3 Storage](https://github.com/hakierka/http-cat-to-web3storage) by @hakierka