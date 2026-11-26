# Sterling Prime Catalogue Correction — Isolated Branch

Base commit: main @ `6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e` (branch created from main tip `c8eda4a2`, README-only test commit) | Generated: 2026-11-26

## What is on this branch

1. **`audit/`** — the complete audit documentation set:
   - `AUDIT_LOG_part1_of_3.csv` … `part3_of_3.csv` — the full audit log, 728 rows (Product ID | SKU | Product Name | Old Category | New Category | Old Image | New Image | Action | Verification Status)
   - `CATEGORY_CHANGES_APPLIED.csv` — the 224 verified category corrections
   - `CONFLICTS_FOR_APPROVAL.csv` — 55 category conflicts needing your decision
   - `HOLD_AND_NOOP.csv` — 3 HOLD business decisions + 25 audit no-ops
   - `MANUAL_IMAGE_REPLACEMENTS.csv` — 293 products needing manual image replacement
   - `DUPLICATE_IMAGES_RECONCILIATION.csv` — all 59 audit duplicate groups vs current repo state
   - `NEW_CATEGORY_IMPLEMENTATION_PLAN.md` — 6 proposed categories with full member lists (PREPARED, NOT APPLIED)
   - `BRAND_VERIFICATION.csv` — all 50 brands verified against the repository (100% count match)
   - `TEST_REPORT.md`, `BEFORE_AFTER_STATS.md`, this README
2. **`audit/apply_category_corrections.py`** — deterministic, safety-gated script that applies the 224 verified category corrections to `catalog_data.js`.

## About catalog_data.js

The corrected `catalog_data.js` (1.5 MB, single-line JSON) is too large for the API commit channel used by this automation session, so **the branch carries the audited, deterministic script instead of a hand-pushed file**. Running

```
python3 audit/apply_category_corrections.py            # apply
python3 audit/apply_category_corrections.py --dry-run  # preview
```

at the repository root rewrites `catalog_data.js` in place and is cryptographically self-verifying at both ends:

- refuses to run unless the current file matches the audited pristine SHA-256 `da3f93e0526d50afb29cb4fe81dbf7d2ee884e5659b4a13f843cee6d6b8c4627` (base commit `6d72cd86` version)
- asserts every one of the 224 Product IDs is still in its audited category before changing it
- asserts the output matches the reviewed corrected SHA-256 `72aa91d6cabe0dc10728f1b9afaea79747f061816fff2345b6d898eb6763c83f`
- changing only `category_name` on exactly the 224 audited records — no titles, SKUs, prices, images, descriptions or record order are touched (proven by field-level diff review)

The identical corrected file is also delivered directly in the offline correction bundle for review.

## What deliberately did NOT change

- **No images were replaced.** Zero candidates passed the positive-verification gates (unassigned source + filename model-code evidence + visually different from the current image and from every other product's image). All 293 flagged products are listed for manual replacement instead — including the three in-house pairs, whose every available source photo is a marketing banner.
- No product records, titles, SKUs, prices or descriptions modified. Nothing deleted (4,936 products stay 4,936).
- No new categories, no navigation changes, no brand categories created.
- `index.html` untouched: the `CATEGORY_FIX` override layer is preserved verbatim. 125 of its entries agree with the audit and are now mirrored into the data layer; the 55 disagreements are escalated, not overwritten.
- `product_images.json` / `product_images.js` untouched (already byte-consistent with catalog paths).

## Approval queue

1. `CONFLICTS_FOR_APPROVAL.csv` — 55 products where the live UI override and the audit disagree
2. `NEW_CATEGORY_IMPLEMENTATION_PLAN.md` — 6 proposed categories (86 / 44 / 40 / 19 / 10 / 26 members)
3. `HOLD_AND_NOOP.csv` — 3 HOLD products + 25 audit no-ops
4. Duplicate-image business decisions — `DUPLICATE_IMAGES_RECONCILIATION.csv` (keep-one-listing / re-photograph policy)

## Verification

See `TEST_REPORT.md` (18 automated before/after integrity checks, all PASS or explicitly unchanged-by-design) and `BEFORE_AFTER_STATS.md` (claim-by-claim reconciliation with the re-audit). Recoverable backup: pristine clone of main @ `6d72cd86…` plus SHA-256 manifest of every edited file taken before editing.
