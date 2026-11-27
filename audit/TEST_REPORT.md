# Sterling Prime — Automated Catalogue Test Report

Run: 2026-11-27 13:38 UTC | Base: main @ 6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e | Branch: isolated correction branch

## Integrity tests (before vs after corrections)
| Test | Before | After | Result |
|---|---|---|---|
| Catalogue product count | 4936 | 4936 | PASS — unchanged |
| Duplicate Product IDs | 0 | 0 | PASS — none |
| Duplicate SKU values (report-only) | 86 values / 180 products | 86 / 180 | UNCHANGED — awaiting business decision |
| Missing thumbnail files | 0 | 0 | PASS — none |
| Missing full-size files | 0 | 0 | PASS — none |
| Malformed image URLs | 0 | 0 | PASS — none |
| References to blocklisted (removed) images | 0 | 0 | PASS — none |
| Shared thumbnail paths (known banner-collision pairs) | 3 | 3 | UNCHANGED — manual decision documented |
| Shared full-image paths | 3 | 3 | UNCHANGED — manual decision documented |
| Category count | 25 | 25 | PASS — no new categories created |
| Products missing description | 0 | 0 | PASS — none |
| Orphan description entries (removed products) | 245 | 245 | DOCUMENTED — 245 legacy keys |
| Image-map entries (product_images.json) | 4936 | 4936 | PASS |
| Image-map JS entries (product_images.js) | 4936 | 4936 | PASS |
| catalog vs image-map mismatches | 0 | 0 | PASS — zero |
| In-house products | 171 | 171 | PASS — unchanged |
| Branded products | 1556 | 1556 | PASS — unchanged |
| Audit Sheet-1 products still present | 65 | 65 | PASS — no records deleted |
| Audit Sheet-2 products still present | 223 | 223 | PASS — no records deleted (223 unique; sp_prod_05449 listed twice in the workbook) |

## Category distribution (changed categories only)
| Category | Before | After |
|---|---|---|

| Audio & Bluetooth Speakers | 165 | 176 |
| Backpacks, Luggage & Travel Bags | 135 | 150 |
| Clocks, Watches & Timepieces | 56 | 70 |
| Copperware & Traditional Metals | 36 | 37 |
| Corporate Apparel & Wearables | 66 | 68 |
| Desk Organizers & Stands | 349 | 306 |
| Diaries, Notebooks & Planners | 244 | 225 |
| Divine Idols & Pooja Gifts | 235 | 231 |
| Executive Combo Gift Sets | 358 | 348 |
| Festive Hampers & Gourmet Foods | 374 | 371 |
| Gift Hampers Packaging & Baskets | 686 | 685 |
| Healthcare & Medical Communication | 22 | 23 |
| Home Appliances & Cookware | 413 | 432 |
| Pens & Luxury Writing | 80 | 88 |
| Perfumes, Fragrances & Personal Care | 59 | 60 |
| Power & Charging Gadgets | 271 | 278 |
| Silver, Brass & Metallic Artifacts | 222 | 221 |
| Smart Tech & Computer Accessories | 290 | 286 |
| Trophies, Awards & Medals | 161 | 164 |
| Wallets, Cardholders & Pouches | 84 | 87 |


## Data-layer consistency checks
- catalog_data.js parses as valid JSON after `window.CATALOG_DATA=`; record order and every field except `category_name` byte-identical to base (script self-test).
- product_images.json / product_images.js: NOT modified (no verified image replacement available in-repo).
- index.html: NOT modified (CATEGORY_FIX overrides preserved verbatim; design, modals, search, filters, lazy loading untouched).
- All 4,936 thumbnail + full-size files resolve on disk via URL-decoded paths.

## Known issues carried forward (not regressions)
1. 86 duplicate SKU values (180 products) — report-only this run.
2. 3 shared in-house image paths (G01/G02/G03) — root cause: webp stem collision between NAME.PNG and NAME.JPEG sources; all available sources are marketing banners.
3. 293 products flagged for manual image replacement (no verified in-repo alternative).
4. 245 orphan description keys from the removed 245-product batch — harmless; optional cleanup.
