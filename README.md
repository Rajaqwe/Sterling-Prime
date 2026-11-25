# Sterling Prime — GitHub Pages website

This repository contains the standalone static Sterling Prime website.

## Live website
https://mysterling.in/

## Site files
- `index.html` — homepage, Journey, catalogue, search, filters, shortlist, enquiries and product detail links.
- `catalog_data.js` — compact catalogue records with WebP thumbnail and full-size paths.
- `product_descriptions.js` — product descriptions loaded on demand.
- `products/thumbs/` and `products/full/` — catalogue image variants.
- `assets/brand_logos/`, `assets/chat/` and `assets/img/` — logos, chat effects and homepage imagery.

The current approved catalogue contains 4,936 products. Product share links use unique product IDs; older `?sku=` links remain readable for compatibility.

The legacy `raw images/` folder and previous homepage backups are retained as rollback/source material. Do not delete them as part of this update.

## Deployment
GitHub Pages serves the repository root. Keep `index.html`, `catalog_data.js`, `product_descriptions.js`, `assets/` and `products/` in their current locations. No Node.js, Next.js build, server, database or Vercel deployment is required.
