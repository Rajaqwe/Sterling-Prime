#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sterling Prime — apply 224 verified category corrections to catalog_data.js
=============================================================================
Branch : catalogue-corrections-2026-11-26
Base   : main @ 6d72cd86ca2a20eb2c7c61b7b89f624d13e9dc8e
Source : Re-Audit workbook (Nov 2026) Sheet 3, existing-category rows verified
         against the live repository (Product ID keyed; SKU never used as key).

What it does
  1. Reads catalog_data.js (repo root).
  2. Asserts the file matches the expected pristine SHA-256 below (safety gate).
  3. Applies exactly the 224 category_name corrections listed in CHANGES
     (each entry asserts the current category before changing it).
  4. Re-serializes compactly in the original format (window.CATALOG_DATA=[...];)
     and verifies the result SHA-256 matches the reviewed corrected file.
  5. Prints a before/after category distribution summary.

Nothing else is touched: no titles, SKUs, prices, images, descriptions, order.
Run from the repository root:  python3 audit/apply_category_corrections.py
(or: python3 audit/apply_category_corrections.js --dry-run for a preview)
"""
import json, sys, hashlib
from collections import Counter
from pathlib import Path

EXPECTED_PRISTINE_SHA256 = "da3f93e0526d50afb29cb4fe81dbf7d2ee884e5659b4a13f843cee6d6b8c4627"
EXPECTED_CORRECTED_SHA256 = "72aa91d6cabe0dc10728f1b9afaea79747f061816fff2345b6d898eb6763c83f"
PREFIX = "window.CATALOG_DATA="

# [Product ID, current category (must match), corrected category]
CHANGES = [
    ["sp_prod_00633", "Audio & Bluetooth Speakers", "Festive Hampers & Gourmet Foods"],
    ["sp_prod_00661", "Audio & Bluetooth Speakers", "Power & Charging Gadgets"],
    ["sp_prod_00664", "Audio & Bluetooth Speakers", "Desk Organizers & Stands"],
    ["sp_prod_01194", "Audio & Bluetooth Speakers", "Clocks, Watches & Timepieces"],
    ["sp_prod_01543", "Audio & Bluetooth Speakers", "Clocks, Watches & Timepieces"],
    ["sp_prod_01652", "Audio & Bluetooth Speakers", "Desk Organizers & Stands"],
    ["sp_prod_00432", "Backpacks, Luggage & Travel Bags", "Desk Organizers & Stands"],
    ["sp_prod_00927", "Backpacks, Luggage & Travel Bags", "Clocks, Watches & Timepieces"],
    ["sp_prod_00928", "Backpacks, Luggage & Travel Bags", "Clocks, Watches & Timepieces"],
    ["sp_prod_00929", "Backpacks, Luggage & Travel Bags", "Clocks, Watches & Timepieces"],
    ["sp_prod_01479", "Backpacks, Luggage & Travel Bags", "Clocks, Watches & Timepieces"],
    ["sp_prod_05488", "Backpacks, Luggage & Travel Bags", "Executive Combo Gift Sets"],
    ["sp_prod_05606", "Backpacks, Luggage & Travel Bags", "Power & Charging Gadgets"],
    ["sp_prod_04852", "Bottles, Sippers & Flasks", "Diaries, Notebooks & Planners"],
    ["sp_prod_05608", "Bottles, Sippers & Flasks", "Smart Tech & Computer Accessories"],
    ["sp_prod_03503", "Clocks, Watches & Timepieces", "Desk Organizers & Stands"],
    ["sp_prod_00905", "Copperware & Traditional Metals", "Home Appliances & Cookware"],
    ["sp_prod_04839", "Corporate Apparel & Wearables", "Pens & Luxury Writing"],
    ["sp_prod_04841", "Corporate Apparel & Wearables", "Pens & Luxury Writing"],
    ["sp_prod_04842", "Corporate Apparel & Wearables", "Pens & Luxury Writing"],
    ["sp_prod_05192", "Corporate Apparel & Wearables", "Smart Tech & Computer Accessories"],
    ["sp_prod_05276", "Corporate Apparel & Wearables", "Smart Tech & Computer Accessories"],
    ["sp_prod_05279", "Corporate Apparel & Wearables", "Smart Tech & Computer Accessories"],
    ["sp_prod_05478", "Corporate Apparel & Wearables", "Backpacks, Luggage & Travel Bags"],
    ["inhouse_0031", "Desk Organizers & Stands", "Healthcare & Medical Communication"],
    ["inhouse_0032", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["inhouse_0039", "Desk Organizers & Stands", "Trophies, Awards & Medals"],
    ["inhouse_0123", "Desk Organizers & Stands", "Gift Hampers Packaging & Baskets"],
    ["sp_prod_00429", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_00556", "Desk Organizers & Stands", "Executive Combo Gift Sets"],
    ["sp_prod_00557", "Desk Organizers & Stands", "Executive Combo Gift Sets"],
    ["sp_prod_00666", "Desk Organizers & Stands", "Diaries, Notebooks & Planners"],
    ["sp_prod_00709", "Desk Organizers & Stands", "Audio & Bluetooth Speakers"],
    ["sp_prod_00885", "Desk Organizers & Stands", "Mugs, Cups & Glassware"],
    ["sp_prod_00901", "Desk Organizers & Stands", "Divine Idols & Pooja Gifts"],
    ["sp_prod_00909", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_00910", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_01236", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_01239", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_01245", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_01462", "Desk Organizers & Stands", "Corporate Apparel & Wearables"],
    ["sp_prod_01515", "Desk Organizers & Stands", "Festive Hampers & Gourmet Foods"],
    ["sp_prod_01756", "Desk Organizers & Stands", "Gift Hampers Packaging & Baskets"],
    ["sp_prod_01797", "Desk Organizers & Stands", "Executive Combo Gift Sets"],
    ["sp_prod_01798", "Desk Organizers & Stands", "Executive Combo Gift Sets"],
    ["sp_prod_02233", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02235", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02300", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02486", "Desk Organizers & Stands", "Smart Tech & Computer Accessories"],
    ["sp_prod_02537", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02544", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02625", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_02626", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_02627", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_02629", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_02630", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_02689", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_02795", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_03339", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_03736", "Desk Organizers & Stands", "Mugs, Cups & Glassware"],
    ["sp_prod_03761", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_03821", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_04465", "Desk Organizers & Stands", "Gift Hampers Packaging & Baskets"],
    ["sp_prod_04861", "Desk Organizers & Stands", "Diaries, Notebooks & Planners"],
    ["sp_prod_04917", "Desk Organizers & Stands", "Dining Sets & Lunch Boxes"],
    ["sp_prod_04932", "Desk Organizers & Stands", "Home Appliances & Cookware"],
    ["sp_prod_05143", "Desk Organizers & Stands", "Clocks, Watches & Timepieces"],
    ["sp_prod_05147", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_05154", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_05159", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05161", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_05182", "Desk Organizers & Stands", "Power & Charging Gadgets"],
    ["sp_prod_05208", "Desk Organizers & Stands", "Audio & Bluetooth Speakers"],
    ["sp_prod_05217", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["sp_prod_05267", "Desk Organizers & Stands", "Smart Tech & Computer Accessories"],
    ["sp_prod_05281", "Desk Organizers & Stands", "Smart Tech & Computer Accessories"],
    ["sp_prod_05397", "Desk Organizers & Stands", "Executive Combo Gift Sets"],
    ["sp_prod_05398", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["sp_prod_05401", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["sp_prod_05402", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["sp_prod_05413", "Desk Organizers & Stands", "Pens & Luxury Writing"],
    ["sp_prod_05430", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05456", "Desk Organizers & Stands", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05457", "Desk Organizers & Stands", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05533", "Desk Organizers & Stands", "Audio & Bluetooth Speakers"],
    ["sp_prod_05576", "Desk Organizers & Stands", "Diaries, Notebooks & Planners"],
    ["sp_prod_05578", "Desk Organizers & Stands", "Diaries, Notebooks & Planners"],
    ["sp_prod_05592", "Desk Organizers & Stands", "Audio & Bluetooth Speakers"],
    ["sp_prod_05594", "Desk Organizers & Stands", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05610", "Desk Organizers & Stands", "Corporate Apparel & Wearables"],
    ["sp_prod_05634", "Desk Organizers & Stands", "Audio & Bluetooth Speakers"],
    ["sp_prod_05638", "Desk Organizers & Stands", "Smart Tech & Computer Accessories"],
    ["sp_prod_00419", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_01179", "Diaries, Notebooks & Planners", "Home Appliances & Cookware"],
    ["sp_prod_01182", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01187", "Diaries, Notebooks & Planners", "Power & Charging Gadgets"],
    ["sp_prod_01191", "Diaries, Notebooks & Planners", "Power & Charging Gadgets"],
    ["sp_prod_01192", "Diaries, Notebooks & Planners", "Power & Charging Gadgets"],
    ["sp_prod_01193", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01198", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01199", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01201", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01202", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01207", "Diaries, Notebooks & Planners", "Smart Tech & Computer Accessories"],
    ["sp_prod_01208", "Diaries, Notebooks & Planners", "Clocks, Watches & Timepieces"],
    ["sp_prod_01211", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_01213", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01214", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01215", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01216", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01217", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_01218", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_01219", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01221", "Diaries, Notebooks & Planners", "Trophies, Awards & Medals"],
    ["sp_prod_01651", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_01653", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_02774", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_03893", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_05000", "Diaries, Notebooks & Planners", "Desk Organizers & Stands"],
    ["sp_prod_05120", "Diaries, Notebooks & Planners", "Smart Tech & Computer Accessories"],
    ["sp_prod_05075", "Dining Sets & Lunch Boxes", "Smart Tech & Computer Accessories"],
    ["sp_prod_00625", "Divine Idols & Pooja Gifts", "Festive Hampers & Gourmet Foods"],
    ["sp_prod_03751", "Divine Idols & Pooja Gifts", "Home Appliances & Cookware"],
    ["sp_prod_04508", "Divine Idols & Pooja Gifts", "Copperware & Traditional Metals"],
    ["sp_prod_04509", "Divine Idols & Pooja Gifts", "Copperware & Traditional Metals"],
    ["sp_prod_04724", "Divine Idols & Pooja Gifts", "Gift Hampers Packaging & Baskets"],
    ["inhouse_0074", "Executive Combo Gift Sets", "Gift Hampers Packaging & Baskets"],
    ["sp_prod_01025", "Executive Combo Gift Sets", "Smart Tech & Computer Accessories"],
    ["sp_prod_01026", "Executive Combo Gift Sets", "Audio & Bluetooth Speakers"],
    ["sp_prod_01027", "Executive Combo Gift Sets", "Audio & Bluetooth Speakers"],
    ["sp_prod_01028", "Executive Combo Gift Sets", "Smart Tech & Computer Accessories"],
    ["sp_prod_01029", "Executive Combo Gift Sets", "Smart Tech & Computer Accessories"],
    ["sp_prod_01030", "Executive Combo Gift Sets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_01031", "Executive Combo Gift Sets", "Desk Organizers & Stands"],
    ["sp_prod_01032", "Executive Combo Gift Sets", "Desk Organizers & Stands"],
    ["sp_prod_01034", "Executive Combo Gift Sets", "Desk Organizers & Stands"],
    ["sp_prod_02622", "Executive Combo Gift Sets", "Home Appliances & Cookware"],
    ["sp_prod_02624", "Executive Combo Gift Sets", "Home Appliances & Cookware"],
    ["sp_prod_04924", "Executive Combo Gift Sets", "Home Appliances & Cookware"],
    ["sp_prod_04955", "Executive Combo Gift Sets", "Corporate Apparel & Wearables"],
    ["sp_prod_04963", "Executive Combo Gift Sets", "Corporate Apparel & Wearables"],
    ["sp_prod_04964", "Executive Combo Gift Sets", "Wallets, Cardholders & Pouches"],
    ["sp_prod_04965", "Executive Combo Gift Sets", "Pens & Luxury Writing"],
    ["sp_prod_04966", "Executive Combo Gift Sets", "Wallets, Cardholders & Pouches"],
    ["sp_prod_04967", "Executive Combo Gift Sets", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05097", "Executive Combo Gift Sets", "Bottles, Sippers & Flasks"],
    ["sp_prod_05277", "Executive Combo Gift Sets", "Power & Charging Gadgets"],
    ["sp_prod_05354", "Executive Combo Gift Sets", "Diaries, Notebooks & Planners"],
    ["sp_prod_05356", "Executive Combo Gift Sets", "Diaries, Notebooks & Planners"],
    ["sp_prod_05357", "Executive Combo Gift Sets", "Diaries, Notebooks & Planners"],
    ["sp_prod_05512", "Executive Combo Gift Sets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05613", "Executive Combo Gift Sets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_00283", "Festive Hampers & Gourmet Foods", "Audio & Bluetooth Speakers"],
    ["sp_prod_00288", "Festive Hampers & Gourmet Foods", "Home Appliances & Cookware"],
    ["sp_prod_00292", "Festive Hampers & Gourmet Foods", "Home Appliances & Cookware"],
    ["sp_prod_01622", "Festive Hampers & Gourmet Foods", "Executive Combo Gift Sets"],
    ["sp_prod_01623", "Festive Hampers & Gourmet Foods", "Executive Combo Gift Sets"],
    ["sp_prod_01624", "Festive Hampers & Gourmet Foods", "Executive Combo Gift Sets"],
    ["sp_prod_01625", "Festive Hampers & Gourmet Foods", "Executive Combo Gift Sets"],
    ["sp_prod_05532", "Festive Hampers & Gourmet Foods", "Home Appliances & Cookware"],
    ["sp_prod_00632", "Gift Hampers Packaging & Baskets", "Festive Hampers & Gourmet Foods"],
    ["sp_prod_04130", "Gift Hampers Packaging & Baskets", "Home Appliances & Cookware"],
    ["sp_prod_04131", "Gift Hampers Packaging & Baskets", "Home Appliances & Cookware"],
    ["sp_prod_04132", "Gift Hampers Packaging & Baskets", "Home Appliances & Cookware"],
    ["sp_prod_04259", "Gift Hampers Packaging & Baskets", "Home Appliances & Cookware"],
    ["sp_prod_04261", "Gift Hampers Packaging & Baskets", "Home Appliances & Cookware"],
    ["sp_prod_02309", "Home Appliances & Cookware", "Power & Charging Gadgets"],
    ["sp_prod_05108", "Home Appliances & Cookware", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_00425", "Mugs, Cups & Glassware", "Desk Organizers & Stands"],
    ["sp_prod_02123", "Mugs, Cups & Glassware", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05581", "Mugs, Cups & Glassware", "Smart Tech & Computer Accessories"],
    ["sp_prod_04855", "Pens & Luxury Writing", "Desk Organizers & Stands"],
    ["sp_prod_04857", "Pens & Luxury Writing", "Desk Organizers & Stands"],
    ["sp_prod_04858", "Pens & Luxury Writing", "Desk Organizers & Stands"],
    ["sp_prod_04976", "Pens & Luxury Writing", "Desk Organizers & Stands"],
    ["sp_prod_05114", "Pens & Luxury Writing", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05344", "Pens & Luxury Writing", "Diaries, Notebooks & Planners"],
    ["sp_prod_05525", "Pens & Luxury Writing", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_00408", "Power & Charging Gadgets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_00652", "Power & Charging Gadgets", "Festive Hampers & Gourmet Foods"],
    ["sp_prod_01185", "Power & Charging Gadgets", "Clocks, Watches & Timepieces"],
    ["sp_prod_01530", "Power & Charging Gadgets", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05165", "Power & Charging Gadgets", "Desk Organizers & Stands"],
    ["sp_prod_05175", "Power & Charging Gadgets", "Smart Tech & Computer Accessories"],
    ["sp_prod_05180", "Power & Charging Gadgets", "Desk Organizers & Stands"],
    ["sp_prod_05186", "Power & Charging Gadgets", "Smart Tech & Computer Accessories"],
    ["sp_prod_05199", "Power & Charging Gadgets", "Desk Organizers & Stands"],
    ["sp_prod_05312", "Power & Charging Gadgets", "Executive Combo Gift Sets"],
    ["sp_prod_05350", "Power & Charging Gadgets", "Executive Combo Gift Sets"],
    ["sp_prod_05352", "Power & Charging Gadgets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05418", "Power & Charging Gadgets", "Desk Organizers & Stands"],
    ["sp_prod_05498", "Power & Charging Gadgets", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_01884", "Silver, Brass & Metallic Artifacts", "Bottles, Sippers & Flasks"],
    ["sp_prod_00569", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00570", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00571", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00572", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00565", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00566", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00567", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_00568", "Smart Tech & Computer Accessories", "Audio & Bluetooth Speakers"],
    ["sp_prod_01189", "Smart Tech & Computer Accessories", "Power & Charging Gadgets"],
    ["sp_prod_01517", "Smart Tech & Computer Accessories", "Mugs, Cups & Glassware"],
    ["sp_prod_01531", "Smart Tech & Computer Accessories", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05089", "Smart Tech & Computer Accessories", "Perfumes, Fragrances & Personal Care"],
    ["sp_prod_05264", "Smart Tech & Computer Accessories", "Pens & Luxury Writing"],
    ["sp_prod_05265", "Smart Tech & Computer Accessories", "Pens & Luxury Writing"],
    ["sp_prod_05303", "Smart Tech & Computer Accessories", "Executive Combo Gift Sets"],
    ["sp_prod_05305", "Smart Tech & Computer Accessories", "Executive Combo Gift Sets"],
    ["sp_prod_05340", "Smart Tech & Computer Accessories", "Executive Combo Gift Sets"],
    ["sp_prod_05343", "Smart Tech & Computer Accessories", "Executive Combo Gift Sets"],
    ["sp_prod_05399", "Smart Tech & Computer Accessories", "Pens & Luxury Writing"],
    ["sp_prod_05400", "Smart Tech & Computer Accessories", "Pens & Luxury Writing"],
    ["sp_prod_05408", "Smart Tech & Computer Accessories", "Pens & Luxury Writing"],
    ["sp_prod_02021", "Trophies, Awards & Medals", "Corporate Apparel & Wearables"],
    ["sp_prod_05437", "Trophies, Awards & Medals", "Backpacks, Luggage & Travel Bags"],
    ["sp_prod_05439", "Trophies, Awards & Medals", "Wallets, Cardholders & Pouches"],
    ["sp_prod_05440", "Trophies, Awards & Medals", "Wallets, Cardholders & Pouches"],
    ["sp_prod_01473", "Wallets, Cardholders & Pouches", "Corporate Apparel & Wearables"],
    ["sp_prod_01474", "Wallets, Cardholders & Pouches", "Corporate Apparel & Wearables"],
    ["sp_prod_01475", "Wallets, Cardholders & Pouches", "Corporate Apparel & Wearables"],
    ["sp_prod_01476", "Wallets, Cardholders & Pouches", "Corporate Apparel & Wearables"],
    ["sp_prod_05144", "Wallets, Cardholders & Pouches", "Power & Charging Gadgets"],
    ["sp_prod_05365", "Wallets, Cardholders & Pouches", "Audio & Bluetooth Speakers"]
]

def sha(t):
    return hashlib.sha256(t.encode("utf-8")).hexdigest()

def main():
    dry = "--dry-run" in sys.argv
    path = Path(__file__).resolve().parent.parent / "catalog_data.js"
    raw = path.read_text(encoding="utf-8")
    actual = sha(raw.rstrip("\r\n") + "\n") if raw.endswith("\n") else sha(raw)
    # normalize: compare content without trailing newline
    body = raw.rstrip("\n")
    print(f"catalog_data.js: {len(body)} chars, sha256={sha(body)[:16]}...")
    if sha(body) != EXPECTED_PRISTINE_SHA256:
        if sha(body) == EXPECTED_CORRECTED_SHA256:
            print("Already corrected — nothing to do.")
            return
        sys.exit(f"SAFETY STOP: catalog_data.js does not match the audited pristine SHA-256.\n"
                 f"  expected {EXPECTED_PRISTINE_SHA256}\n  got      {sha(body)}\n"
                 f"Refusing to apply corrections to an unexpected file.")
    data = json.loads(body[body.index("["): body.rindex("]") + 1])
    assert len(data) == 4936, f"expected 4936 records, got {len(data)}"
    by_id = {p["id"]: p for p in data}
    assert len(by_id) == 4936, "duplicate Product IDs detected"
    before = Counter(p["category_name"] for p in data)
    applied = 0
    for pid, frm, to in CHANGES:
        p = by_id[pid]
        if p["category_name"] != frm:
            sys.exit(f"SAFETY STOP: {pid} currently in '{p["category_name"]}', expected '{frm}'. Catalogue drifted since audit; re-run verification.")
        if not dry:
            p["category_name"] = to
        applied += 1
    out = PREFIX + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    if dry:
        print(f"DRY RUN OK: {applied} corrections validated (no file written).")
        return
    path.write_text(out, encoding="utf-8")
    final = sha(out.rstrip("\n"))
    print(f"applied {applied} corrections; new sha256={final}")
    if final != EXPECTED_CORRECTED_SHA256:
        sys.exit("WARNING: output SHA-256 does not match the reviewed corrected file — investigate before committing.")
    after = Counter(p["category_name"] for p in data)
    print("Category distribution changes:")
    for c in sorted(set(before) | set(after)):
        if before[c] != after[c]:
            print(f"  {c}: {before[c]} -> {after[c]}")
    print("OK — catalog_data.js corrected. Verify the site locally before merging; main is untouched.")

if __name__ == "__main__":
    main()
