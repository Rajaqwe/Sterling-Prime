# Branch Status & Offline Correction Bundle Manifest

**Branch:** `catalogue-corrections-2026-11-26` (isolated, created from main tip `c8eda4a2` — a README-only test commit)
**Base catalogue:** main @ `6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e`
**Generated:** 2026-11-26 | **Verified corrections:** 224 category moves (existing categories only) | **Nothing merged to main, nothing deployed.**

## Why the data file and CSVs are not committed here

The automation channel that writes to GitHub accepts only file contents typed inline in a single
message. `catalog_data.js` is 1.5 MB of single-line JSON and the audit CSVs total ~460 KB — larger
than can be transmitted faithfully through that channel, and a truncated commit would be a silent
data corruption risk. The safe path used instead:

1. Every corrected artefact was generated programmatically and is delivered as an **offline
   correction bundle** with the SHA-256 manifest below.
2. `audit/apply_category_corrections.py` (in the bundle) re-creates `catalog_data.js` from the
   pristine base commit **byte-for-byte** (verified: output SHA-256 equals the reviewed corrected
   file) with safety gates on every one of the 224 Product IDs.

## Offline bundle contents (verify with `sha256sum` after download)

| File | Size (bytes) | SHA-256 (first 16) |
|---|---|---|
| `catalog_data.js` (corrected) | 1,552,963 | `de0071ddfc9bd6d3` |
| `audit/apply_category_corrections.py` | 22,988 | `2b64358f76a2c7c7` |
| `audit/README.md` | 4,214 | `7aa4eed99bcdfb70` |
| `audit/TEST_REPORT.md` | 3,648 | `d655a2e0565e83ad` |
| `audit/BEFORE_AFTER_STATS.md` | 5,290 | `27ec522ec2bc4f4d` |
| `audit/BRAND_VERIFICATION.csv` | 3,387 | `0554e6b78018b3db` |
| `audit/CATEGORY_CHANGES_APPLIED.csv` (224 rows) | 51,795 | `0b7f36c840fcb411` |
| `audit/CONFLICTS_FOR_APPROVAL.csv` (55 rows) | 10,190 | `05b61693108f47d7` |
| `audit/HOLD_AND_NOOP.csv` (28 rows) | 5,301 | `b2d2b8494fe0c55f` |
| `audit/MANUAL_IMAGE_REPLACEMENTS.csv` (293 rows) | 65,141 | `7dcfa20a3645b6c3` |
| `audit/DUPLICATE_IMAGES_RECONCILIATION.csv` (59 groups) | 21,952 | `fbf7f28aba556509` |
| `audit/NEW_CATEGORY_IMPLEMENTATION_PLAN.md` | 28,425 | `ca24374357fade6a` |
| `audit/AUDIT_LOG_part1_of_3.csv` (243 rows) | 75,862 | `51a61f3e3ece49fd` |
| `audit/AUDIT_LOG_part2_of_3.csv` (243 rows) | 60,512 | `c79ca8b2b7bf624b` |
| `audit/AUDIT_LOG_part3_of_3.csv` (242 rows) | 60,496 | `d65de29a964af986` |
| `AUDIT_LOG_full.csv` (728 rows, bundle root) | 196,660 | `09f02489b069406a` |

## How to apply the corrections (after review)

```bash
# from a clone of this branch (or main, if you prefer to apply on a fresh branch)
python3 audit/apply_category_corrections.py --dry-run   # validates all 224 gates, writes nothing
python3 audit/apply_category_corrections.py             # applies + verifies output SHA-256
git add catalog_data.js && git commit -m "Apply 224 verified category corrections (audit 2026-11-26)"
```

The script refuses to run against any file other than the audited pristine `catalog_data.js`
(SHA-256 `da3f93e0526d50afb29cb4fe81dbf7d2ee884e5659b4a13f843cee6d6b8c4627` = base commit
`6d72cd86`) and refuses any Product ID whose current category has drifted since the audit.

## Integrity summary (full detail in the bundle)

- 4,936 products before = 4,936 after; 0 records deleted; 0 duplicate Product IDs.
- 25 categories before = 25 after (no new categories; navigation untouched).
- 224 category corrections applied at data level; 55 conflicts + 3 HOLD + 70 new-category rows escalated, not applied.
- 293 products flagged for manual image replacement; 0 images replaced (none verifiable in-repo).
- All 50 brand counts match the audit exactly; 86 duplicate SKU values reported unchanged (report-only).
