# Sterling Prime catalogue audit — commit notes

## Changes applied

- 373 confirmed mismatches with a distinct recommended category.
- 3 office stationery items moved to the new **Office Stationery Tools** category.
- 8 keychain products moved to **Plush, Keychains & Fun Gifts**.
- 96 borderline products with explicit best-fit recommendations re-categorised.
- The remaining 915 borderline products are unchanged: 764 have no recommendation and 151 are marked acceptable in their current category.
- In-house products are synchronised between the public RAW map and the catalogue data at page runtime. New in-house codes are `O` (Office Stationery Tools) and `W` (Bottles, Sippers & Flasks).

The fixes are applied through `catalog_category_overrides.js`, loaded by both the desktop and mobile catalogue pages before rendering. The large `catalog_data.js` source file is preserved as-is; the browser merges the overrides into `window.CATALOG_DATA` before the product grid is built.

## Held for supplier-source verification

These five records were not changed because the workbook's recommended category repeats the current category, or the notes point to a product/image identity issue rather than a safe category correction:

- `sp_prod_01205` — M2 notebook-organizer title versus a powerhub/lamp/power-bank image description.
- `sp_prod_01549` — Nap Ninja neck pillow; recommended category repeats Executive Combo Gift Sets.
- `sp_prod_01626` — DT 2300 festive decor/gift-tag observation; recommended category repeats Gift Hampers Packaging & Baskets.
- `sp_prod_02887` — gymbag title versus a gym-rope/poster image description.
- `sp_prod_05264` — flag/table-stand title versus a torch/USB image description.

No product titles, descriptions, prices, brands, SKUs, or image paths were rewritten.

## Image cleanup

The 5,181 live products have 5,181 unique image references: 171 in-house images and 5,010 partner images. All referenced paths exist in the repository.

The partner image folder contained 7,082 files; **2,072 were not referenced by the current catalogue data** and are removed in this commit. All 5,010 product-linked partner images are retained, as are all 171 in-house images.

## Verification

Run `node scripts/verify-catalog-audit.mjs` from the repository root. The script checks product counts, unique IDs and image references, both HTML in-house maps, category override values, and the existence of every referenced image.
