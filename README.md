
# Orbit Engineering Company

Responsive engineering company website built with React, Vite and Tailwind CSS.

Includes Home, About, Products, Solutions, Ecosystem and Contact pages, a 104-product catalogue across 22 categories, client and partner directories, and the company's Bhopal office location.

## Run locally

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:3000`.

## Production build

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`. Vercel SPA rewrites are provided in `vercel.json`.

## Project files

- `src/`: React pages, components, styles, configuration, product information and original/processed assets.
- `public/`: website images, branding and logos.
- `ECOSYSTEM_AND_PRODUCTS_SPECIFICATION.md`: catalogue and ecosystem content reference.
- `ECOSYSTEM_WEBSITES.md`: researched client and partner destinations, including unresolved identities.

Keep `src/assets/` intact: the asset registry resolves original files, cutouts, optimized images and product PDFs from this directory.

Company information and the office's Google Maps destination are maintained in `src/config/siteConfig.js`. Official client and partner websites are maintained in `src/data/ecosystemWebsites.js`.
