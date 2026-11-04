import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const dataText = fs.readFileSync(path.join(root, "catalog_data.js"), "utf8");
const start = dataText.indexOf("[");
const end = dataText.lastIndexOf("]");
assert(start >= 0 && end > start, "catalog_data.js must contain a JSON array");
const products = JSON.parse(dataText.slice(start, end + 1));
assert.equal(products.length, 5181);
const byId = new Map(products.map((p) => [p.id, p]));
assert.equal(byId.size, 5181, "product IDs must be unique");
assert.equal(products.filter((p) => p.type === "inhouse").length, 171);
assert.equal(products.filter((p) => p.type === "partner_product").length, 5010);

const overridesText = fs.readFileSync(path.join(root, "catalog_category_overrides.js"), "utf8");
const ovMatch = overridesText.match(/window\.CATALOG_CATEGORY_OVERRIDES = ([\s\S]*);\s*$/);
assert(ovMatch, "category override file must expose a JSON object");
const overrides = JSON.parse(ovMatch[1]);
assert.equal(Object.keys(overrides).length, 480, "expected 480 audit category decisions");
for (const [id, v] of Object.entries(overrides)) {
  assert(byId.has(id), "unknown override product " + id);
  assert(v.category && v.category_slug && v.category_name);
  assert.equal(v.category, v.category_slug);
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const mobileHtml = fs.readFileSync(path.join(root, "public/sterling-prime-mobile-optimised.html"), "utf8");
const extractRaw = (html, label) => {
  const match = html.match(/const RAW=`([\s\S]*?)`;/);
  assert(match, label + " must contain the in-house RAW map");
  return match[1];
};
const raw = extractRaw(indexHtml, "index.html");
assert.equal(extractRaw(mobileHtml, "mobile page"), raw, "desktop/mobile in-house maps must match");
assert(indexHtml.includes("catalog_category_overrides.js"));
assert(mobileHtml.includes("catalog_category_overrides.js"));
assert(indexHtml.includes("CATALOG_CATEGORY_OVERRIDES"));
assert(mobileHtml.includes("CATALOG_CATEGORY_OVERRIDES"));
const rows = raw.split("\n");
assert.equal(rows.length, 171);
const FULL = {
  D:"Desk Organizers & Stands",P:"Pens & Luxury Writing",K:"Executive Combo Gift Sets",
  B:"Backpacks, Luggage & Travel Bags",C:"Clocks, Watches & Timepieces",S:"Desk Organizers & Stands",
  H:"Healthcare & Medical Communication",F:"Plush, Keychains & Fun Gifts",
  T:"Smart Tech & Computer Accessories",O:"Office Stationery Tools",W:"Bottles, Sippers & Flasks"
};
const inhouseCategory = (n, code) => n>=48&&n<=50 ? "Diaries, Notebooks & Planners" :
  n>=80&&n<=88 ? "Wallets, Cardholders & Pouches" : FULL[code];
for (let i=0;i<rows.length;i++) {
  const [imageFile,,code]=rows[i].split("|");
  assert(imageFile&&code);
  assert(inhouseCategory(i+1,code),"unknown in-house category code "+code);
}
const imagePaths = new Set();
for (const p of products) {
  const imagePath=decodeURIComponent(p.image_path||p.image||"");
  assert(imagePath,"missing image path for "+p.id);
  imagePaths.add(imagePath);
  assert(fs.existsSync(path.resolve(root,imagePath)),"missing image file for "+p.id+": "+imagePath);
}
assert.equal(imagePaths.size,5181,"image paths should be unique");
for(const id of ["inhouse_0022","inhouse_0159","inhouse_0160"])
  assert.equal(overrides[id]?.category_slug,"office-stationery-tools");
for(const id of ["sp_prod_00509","sp_prod_00510","sp_prod_00511","sp_prod_00512","sp_prod_00513","sp_prod_01820","sp_prod_01822","sp_prod_01823"])
  assert.equal(overrides[id]?.category_slug,"plush-keychains-fun-gifts");
console.log("Catalogue audit verification passed: 5,181 products; 480 overrides; 5,181 unique, existing image references; both static pages updated.");
