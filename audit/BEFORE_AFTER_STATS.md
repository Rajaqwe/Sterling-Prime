# Sterling Prime — Before/After Catalogue Statistics & Reconciliation

Base: main @ 6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e | Corrections branch | Run 2026-11-27 13:38 UTC

## Headline numbers
| Metric | Before | After |
|---|---|---|
| Products | 4,936 | 4,936 (no records deleted) |
| Categories | 25 | 25 (no new categories created) |
| Products with corrected category | — | 224 |
| Category conflicts escalated | — | 55 |
| HOLD products (not moved) | — | 3 |
| Audit no-op rows (target = current) | — | 25 |
| Products deferred to new-category plan | — | 71 (70 NEW rows + 1 mislabeled row) |
| Products flagged for manual image replacement | 289 (audit) | 293 documented (289 + 4 shared-path pair members) |
| Images actually replaced this run | — | 0 (no in-repo verified alternative; flag-only policy) |
| Branded / unbranded products | 1,556 / 3,380 | unchanged |
| Duplicate SKU values | 86 (180 products) | unchanged — report-only |

## Category moves applied (top)
| From | To | Count |
|---|---|---|
| Desk Organizers & Stands | Power & Charging Gadgets | 12 |
| Desk Organizers & Stands | Backpacks, Luggage & Travel Bags | 10 |
| Diaries, Notebooks & Planners | Desk Organizers & Stands | 9 |
| Smart Tech & Computer Accessories | Audio & Bluetooth Speakers | 8 |
| Desk Organizers & Stands | Home Appliances & Cookware | 7 |
| Diaries, Notebooks & Planners | Clocks, Watches & Timepieces | 7 |
| Desk Organizers & Stands | Pens & Luxury Writing | 6 |
| Diaries, Notebooks & Planners | Trophies, Awards & Medals | 6 |
| Desk Organizers & Stands | Executive Combo Gift Sets | 5 |
| Desk Organizers & Stands | Audio & Bluetooth Speakers | 5 |
| Gift Hampers Packaging & Baskets | Home Appliances & Cookware | 5 |
| Smart Tech & Computer Accessories | Pens & Luxury Writing | 5 |
| Backpacks, Luggage & Travel Bags | Clocks, Watches & Timepieces | 4 |
| Desk Organizers & Stands | Diaries, Notebooks & Planners | 4 |
| Desk Organizers & Stands | Smart Tech & Computer Accessories | 4 |

## Reconciliation vs previous audit / re-audit claims
| Claim | This run's verification | Status |
|---|---|---|
| 4,936 live products, 171 in-house + 4,765 partner | catalog: 4,936 / 171 in-house | CONFIRMED |
| 245 previously flagged non-product images removed | removed_product_images_list.txt = 245 entries; zero referenced by catalog | CONFIRMED |
| Descriptions cover all products | 4,936/4,936 covered; 245 orphan keys from removed batch (5,181 total) | EXPLAINED: 5,181 - 245 = 4,936 |
| 378 category-wrong products (305 existing / 70 new / 3 HOLD) | 378 rows verified; 305 existing-target rows = 224 applicable + 55 conflicts + 25 no-ops + 3 HOLD; 70 NEW + 1 mislabeled deferred | RECONCILED with breakdown |
| 86 duplicate SKU values | 86 values / 180 products found (report-only) | CONFIRMED |
| 59 duplicate groups: 40 identical / 7 byte-identical / 10 variant / 9 different | 40 identical groups reconfirmed (37 at dHash<=1, 3 borderline d4-9); 7 byte-identical = 3 shared-path pairs + 4 byte-identical file pairs; 10 variant (dHash 4-21); 9 different confirmed | CONFIRMED |
| Previous shared-image-path findings vs 40 identical groups | exactly 3 shared paths site-wide (inhouse_0008/0009, 0016/0017, 0090/0091) — all banner webp stem collisions | RECONCILED |
| 23 brands qualify for brand category | exactly 23 brands with >=10 products; all 50 audit brand counts match repo exactly | CONFIRMED |
| 3,209 partner products without brand | 3,380 total without brand - 171 in-house = 3,209 | CONFIRMED |

## New findings this run (not in the audit)
1. In-house duplicate pairs are caused by a webp filename collision: sources DESK ORGANISER.PNG and DESK ORGANISER.JPEG (and MOBILE STAND / DESK CLOCK) both derive to the same .webp name in index.html's RAW derivation; the banner (PNG) overwrote the clean photo. All six sources are marketing banners, so no correct photo exists in-repo for any of the six products.
2. The 4 supplier byte-identical pairs (G11, G33, G37, G49) are byte-identical at SOURCE (same uploaded photo under two filenames): csr_06==csr_07, ml_400==gsl_01, bw_35==bw_34, wonder_p54_02==wonder_p54_03.
3. index.html contains a CATEGORY_FIX override layer (470 entries, added 2026-11-04) that already moves categories at render time; catalog_data.js was never aligned. This run aligns the data layer for the 125 entries where the override agrees with the audit, applies 99 previously-uncovered moves, and escalates 55 disagreements.
4. 24 CATEGORY_FIX entries reference Product IDs that no longer exist in the catalogue (removed 2026-11-05 batch) — inert but worth pruning.
5. Audit workbook blemishes: sp_prod_05449 listed twice on Sheet 2 (224 rows = 223 unique products); 1 Sheet-3 row marked 'Existing category' targets the proposed 'Wellness & Massage Devices'; 25 Sheet-3 rows suggest the current category (no-op).
6. Sheet-1 placeholder products share visually identical 'image coming soon' assets (dHash 0-3), which explains audit group G10 being a hash-cluster of placeholders rather than one product photo.
7. G20 members (SKUs TGD-3068/TGD-3069) are ambiguous: each SKU maps to TWO product IDs (sp_prod_00989/01068, sp_prod_00990/01069) — a direct consequence of the duplicate-SKU problem; manual identification required.
