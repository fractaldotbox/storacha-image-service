# Storacha Image Service

# Motiviations

Often we need performant and flexible image service, from avatar to placeholders.

Applying Generative AI is great but we need cost effective storage with fast (cached) retrieval

For best of both worlds, this is a micro CMS to store asasets on filecoin (via storacha) and welcome end-user to contribute in a decentralized way 

This is a project to demo
- storacha's UCAN supporting [Delegated upload flow](https://docs.storacha.network/concepts/architecture-options/#delegated)
- Fast retrieval of filecoin 


and I find the use case actually useful!


## Deployment targets
- Cloudflare pages
  - Opt for wrangler as we want to incorp multiple projects in this repo
  - use env variables on .env for auth
  - `env-cmd pnpm --filter cms deploy`
- Fleek

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


