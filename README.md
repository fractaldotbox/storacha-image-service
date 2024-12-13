
# 🐱 Storacha Image Service

**Storacha Image Service** is a decentralized image hosting micro-CMS inspired by [http.cat](https://http.cat/). It serves HTTP status code images via IPFS/Filecoin and allows end-users to contribute new images in a decentralized manner. The project demonstrates Storacha's UCAN delegation flow, leveraging the power of decentralized storage for cost-effective, performant image services.

### 🚀 [Demo Video](https://bafybeifqd3546gsizaqzxuptlnbstugqi22qhhk57uam4has6ivfqtdlf4.ipfs.w3s.link/)

## 🌟 Motivations

Websites often need flexible, performant image services for avatars, placeholders, or status codes. While generative AI can help produce images, cost-effective storage with fast, cached retrieval is crucial.

**Storacha Image Service** provides the best of both worlds:
1. **Decentralized Storage**: Store assets on Filecoin via Storacha.
2. **Static Site Deployment**: Deploy static sites with APIs and optimized retrieval URLs.
3. **User Contributions**: Enable end-users to upload images via a decentralized flow.

### 🔗 Key Demonstrations:
- **Storacha’s UCAN Delegated Upload Flow**: [Documentation](https://docs.storacha.network/concepts/architecture-options/#delegated)
- **Immutable, Trustless Websites** on IPFS/Filecoin.



## 🚧 Deployment Targets

### 1. **Render**
- Deployed using the Astro Node adapter.

### 2. **Cloudflare Pages**
- **Current Issue**: Facing build issues with Vite configuration for both client-side and Astro SSR.
- **Planned Solution**: Use **Wrangler** to incorporate multiple projects in this repo.
- **Environment Variables**: Use `.env` for authentication.
- Deployment Command:
  ```bash
  env-cmd pnpm --filter cms deploy
  ```

### 3. **Fleek (TODO)**


## 📤 Uploading Content (Bootstrap)

We support dynamic content by decoupling the upload flow from site deployment. This ensures flexibility in choosing data sources and gateways.

**Upload Command**:
```bash
env-cmd pnpm --filter content upload:httpcat
```


## 🏗️ Architecture

### Overview
- **Pre-Created Space**: Utilizes Storacha's UCAN for delegated end-user uploads.
- **Static Site Generation**: Astro (v5.0) to export the site.
- **Key Features**:
  - **Image Showcase**  
  - **Upload Page** (with authentication)

### Technologies
- **Astro (v5.0)**: For static site generation.
- **w3ui/react**: Used in a single component for now.
- **Jotai (TODO)**: For client-side state management.  
  [Astro State Sharing Docs](https://docs.astro.build/en/recipes/sharing-state-islands/)

---

## 🐱 Demo Services

### **HttpCat**
- Serve cat images corresponding to HTTP status codes.
- Hybrid approach of pre-existing and end-user uploads.

🔗 **Live Demo**: [HttpCat Demo](https://storacha-image-service.onrender.com/httpcat/)



## 🛠️ Reference Use Cases

### Placeholder Services
- [dummyimage.com](https://dummyimage.com/)  
- [placecats.com](https://placecats.com/)  
- [doodleipsum.com](https://doodleipsum.com/)

### Avatar Services
- Avatars, status codes, and token-based image generation.


## 🙌 Acknowledgements

### **HTTPCat**
- **Developer**: [@rogeriopvl](https://github.com/rogeriopvl)  
- **Original Images**: [Tomomi Imura (@girlie_mac)](https://github.com/girlie_mac)


