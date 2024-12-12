# Storacha Image Service

# Motiviations

Often we need performant and flexible image service at websites, from avatars to placeholders.
Applying Generative AI is great but we need cost effective storage with fast (cached) retrieval

For best of both worlds, this is a micro CMS to 
1. store assets on filecoin (via storacha), deploy static sites with API & optimized retrieval urls
2.  elcome end-user to contribute in a decentralized way 

serving as a demo for
- storacha's UCAN supporting [Delegated upload flow](https://docs.storacha.network/concepts/architecture-options/#delegated)
- creating immutable trustless websites on IPFS/Filecoin

## Deployment targets
- Cloudflare pages
  - Opt for wrangler as we want to incorp multiple projects in this repo
  - use env variables on .env for auth
  - `env-cmd pnpm --filter cms deploy`
- Fleek (TODO)

## Uploading content (Bootstrap)
- we opt for supporting dynamic content on unopinionated data source and gateway (instead of relying astro to serve static assets from where site is deployed).
- Thus we decoupled content upload flow via storacha, from site deployment 
  - run `env-cmd pnpm --filter content upload:httpcat`

## Architecture
- Pre-created space with UCAN for direct end-user upload in [Delegated upload flow](https://docs.storacha.network/concepts/architecture-options/#delegated)
- Astro (5.0) to export a static sites, consisting of
  - image showcase
  - upload page

- use w3ui/react in single component for now and separate static vs upload page (auth requires)
- TODO switch to jotai for client state
  - https://docs.astro.build/en/recipes/sharing-state-islands/

## Demo services

### HttpCat
- Cat image for each HTTP status
- Hybird of pre-existing upload and end-user upload

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
  - note original repo missed images for 495.jpg, 496.jpg