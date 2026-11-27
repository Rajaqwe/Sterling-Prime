# Branch Status & Correction Manifest

**Branch:** `catalogue-corrections-2026-11-26` (isolated, created from main tip `c8eda4a2` — a README-only test commit)
**Base catalogue:** main @ `6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e`
**Generated:** 2026-11-26 | **Committed:** 2026-11-27 | **Verified corrections:** 224 category moves (existing categories only) | **Nothing merged to main, nothing deployed.**

## Update 2026-11-27 — artefacts committed on this branch

The 2026-11-26 session had to ship the corrected data as an **offline correction bundle**
(the automation channel available then accepted only contents typed inline in a single message,
and `catalog_data.js` is 1.5 MB of single-line JSON — a truncated commit would have been a silent
corruption risk; see the historical manifest at the bottom).

A later session with direct git access re-verified everything from the pristine base and committed
the artefacts here, file by file, with a byte-for-byte blob comparison after every push:

1. All working files were regenerated from the pristine base commit with the same deterministic
   scripts. Every data-bearing artefact reproduces its reviewed SHA-256 exactly — including the
   corrected `catalog_data.js`, the 224-row worklist, all three audit-log parts and the 728-row
   full log.
2. `audit/apply_category_corrections.py` was re-tested end to end on a scratch clone:
   `--dry-run` validates all 224 gates on the pristine file and writes nothing; a real run applies
   the 224 moves and produces `catalog_data.js` at SHA-256 `de0071ddfc9bd6d3421f52961d5665a4d4146
   18e4d3ef027c76297432ece1ae3` — byte-identical to the reviewed corrected file; re-running on the
   corrected file safely reports "Already corrected — nothing to do."
3. Three timestamp-stamped `.md` reports carry a fresh run timestamp (content otherwise identical,
   same byte size). `MANUAL_IMAGE_REPLACEMENTS.csv` uses the documented 293-row convention
   (289 audit-flagged + 4 shared-path pair members, matching workbook sheet "3-Manual Image List").

## Committed on this branch (verify with `sha256sum`)

Line-ending note: the repository declares `* text=auto` (LF normalisation), so the CSVs are
committed LF, without BOM — content-identical to the offline bundle copies (which keep CRLF + BOM
for Excel). The `.md` / `.py` artefacts are byte-identical to the reviewed bundle (the three `.md`
reports carry a fresh run timestamp). `BRANCH_STATUS.md` itself is excluded from the table (a file
cannot contain its own hash).

| File | Size (bytes) | SHA-256 |
|---|---|---|
| `audit/apply_category_corrections.py` | 22,988 | `2b64358f76a2c7c7b641349c2029ae26737b278beb6b0c18149d8edb44d34c92` |
| `audit/README.md` | 4,214 | `7aa4eed99bcdfb703624fdc9b7916f3ac40e94157a7f0c0f8c304c8302981401` |
| `audit/TEST_REPORT.md` | 3,648 | `677417e4f034a0a36fc6838a9f374188e69d9e506da50d94cb8d8b04bad08b3c` |
| `audit/BEFORE_AFTER_STATS.md` | 5,290 | `516bb2f57ab56ec81dfba3b89b3c3e069243ebe4d5429315615ff479ad582069` |
| `audit/BRAND_VERIFICATION.csv` | 3,333 | `e330532c7b001af07268d372be79e1a5c437464368e693d8c5ea344914f61010` |
| `audit/CATEGORY_CHANGES_APPLIED.csv` (224 rows) | 51,567 | `fadf45219d317b076f83fd083ae1385f14bfb41940a78dd91a3944c6b8145119` |
| `audit/CONFLICTS_FOR_APPROVAL.csv` (55 rows) | 10,131 | `99de804a3af40b95dda83dbc1fd15073d4665956d4f7a37d7894ca361256786d` |
| `audit/HOLD_AND_NOOP.csv` (28 rows) | 5,269 | `1dd7002c046ceb0f5b60be83de7331477a501a88f1b2ce39e35bd4141d7706f7` |
| `audit/MANUAL_IMAGE_REPLACEMENTS.csv` (293 rows) | 64,820 | `c6b9f08fc7f13031d35d0774027a5c068a77adc917625ab92822572c97b44b35` |
| `audit/DUPLICATE_IMAGES_RECONCILIATION.csv` (59 groups) | 21,889 | `82450722f72e4d851083e9c618c3ce8ea3cdf542a7a9f23f87666b2fed16ae5e` |
| `audit/NEW_CATEGORY_IMPLEMENTATION_PLAN.md` | 28,425 | `6dda598077eeac75324a76296609e39a31135dbdf8244aada6e73d44ecb8a2c5` |

## Delivered via the offline correction bundle (not in this git tree)

These four artefacts exceed the inline commit channel or were kept out of the branch by size; each
is delivered in the bundle with the SHA-256 below, and the first one is byte-for-byte reproducible
from this branch via the apply script:

| File | Size (bytes) | SHA-256 | How to obtain |
|---|---|---|---|
| `catalog_data.js` (corrected) | 1,552,963 | `de0071ddfc9bd6d3421f52961d5665a4d414618e4d3ef027c76297432ece1ae3` | bundle copy, or `git show 6d72cd86:catalog_data.js > catalog_data.js && python3 audit/apply_category_corrections.py` |
| `AUDIT_LOG_part1_of_3.csv` (243 rows) | 75,615 | `2f1ba08c477b98cd27ee154c634f366dab80527c8f29ccb8c67682828bceb963` | bundle copy (LF) |
| `AUDIT_LOG_part2_of_3.csv` (243 rows) | 60,265 | `cef019d49f266853633265b83c967ccd73a9c91c78c8c8e075e4d063fdbc08fa` | bundle copy (LF) |
| `AUDIT_LOG_part3_of_3.csv` (242 rows) | 60,250 | `741c50745036f484eec4439ebe7ac8f59e50109a39f09ff3c5502038e9aeceb2` | bundle copy (LF) |
| `AUDIT_LOG_full.csv` (728 rows, bundle root) | 196,660 | `09f02489b069406a969764eaa13dbc26a05ad2df509e2d56c16ba2c2c05ea68c` | bundle copy (CRLF + BOM, Excel-ready) |

The three log parts are a plain 243/243/242 split of `AUDIT_LOG_full.csv` (728 rows), which is in
turn the union of the worklist CSVs above — nothing in the log is unavailable on this branch in
worklist form; the log files add only the single-file convenience view.

## How to verify / reproduce

```bash
# from a clone of this branch
sha256sum catalog_data.js audit/*            # compare against the tables above
python3 audit/apply_category_corrections.py --dry-run   # on a corrected file: "Already corrected"
```

Against a pristine base commit the script re-creates the corrected file byte-for-byte:

```bash
git show 6d72cd86:catalog_data.js > catalog_data.js   # revert to audited pristine
python3 audit/apply_category_corrections.py           # 224 gates + SHA-256 verification
git add catalog_data.js && git commit -m "Apply 224 verified category corrections (audit 2026-11-26)"
```

The script refuses to run against any file other than the audited pristine `catalog_data.js`
(SHA-256 `da3f93e0526d50afb29cb4fe81dbf7d2ee884e5659b4a13f843cee6d6b8c4627` for the newline-stripped
body; the file as stored at base commit `6d72cd86` — with its trailing newline — is
`7ea53134ee5ac4655b40d86a78102d12e1860192053693a824125cad281feb58`) and refuses any Product ID
whose current category has drifted since the audit.

## Integrity summary

- 4,936 products before = 4,936 after; 0 records deleted; 0 duplicate Product IDs.
- 25 categories before = 25 after (no new categories; navigation untouched).
- 224 category corrections applied at data level; 55 conflicts + 3 HOLD + 70 new-category rows escalated, not applied.
- 293 products flagged for manual image replacement; 0 images replaced (none verifiable in-repo).
- All 50 brand counts match the audit exactly; 86 duplicate SKU values reported unchanged (report-only).

---

## Historical: 2026-11-26 offline correction bundle (superseded by the artefacts above)

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
