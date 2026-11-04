import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const audit = JSON.parse(fs.readFileSync(path.join(root, "docs/audits/sterling-prime-category-corrections-2026-11-04.json"), "utf8"));
const source = fs.readFileSync(path.join(root, "catalog_data.js"), "utf8");
const match = source.match(/window\.CATALOG_DATA\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
if (!match) throw new Error("catalog_data.js does not expose a JSON array");
const products = JSON.parse(match[1]);
if (products.length !== audit.summary.catalogueProducts) throw new Error("Catalogue count mismatch");
const byId = new Map(products.map(p => [p.id, p]));
if (byId.size !== products.length) throw new Error("Duplicate product IDs detected");

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const fixMatch = index.match(/const CATEGORY_FIX=(\{[\s\S]*?\});\s*P=window\.CATALOG_DATA/);
if (!fixMatch) throw new Error("index.html has no runtime category correction map");
const fixes = JSON.parse(fixMatch[1]);
if (Object.keys(fixes).length !== audit.summary.totalCategoryChanges) throw new Error("Category correction count mismatch");

for (const item of audit.categoryChanges) {
  const p = byId.get(item.id);
  const fix = fixes[item.id];
  if (!p || !fix) throw new Error("Missing product/category override " + item.id);
  if (fix.name !== item.newCategory || fix.slug !== item.categorySlug) throw new Error("Override differs from audit log for " + item.id);
}
for (const p of products) {
  const rel = decodeURIComponent(p.image_path || p.image || "");
  if (!fs.existsSync(path.join(root, rel))) throw new Error("Missing product image for " + p.id + ": " + rel);
}
for (const item of audit.rejectedRecommendations) {
  const p = byId.get(item.id);
  if (!p || fixes[item.id] || p.category_name !== item.currentCategory) throw new Error("Rejected category recommendation was applied for " + item.id);
}
for (const item of audit.imageCleanup.deletedCopies) {
  if (fs.existsSync(path.join(root, item.path))) throw new Error("Deleted duplicate still exists: " + item.path);
  if (!fs.existsSync(path.join(root, item.keep))) throw new Error("Retained duplicate is missing: " + item.keep);
}
console.log(JSON.stringify({
  catalogueProducts: products.length,
  uniqueProductIds: byId.size,
  categoryOverrides: Object.keys(fixes).length,
  imageReferencesChecked: products.length,
  rejectedReportRecommendations: audit.rejectedRecommendations.length,
  supplierSourceCasesHeld: audit.heldForOriginalSupplierSourceReview.length,
  exactDuplicateCopiesRemoved: audit.imageCleanup.deletedCopies.length
}, null, 2));
