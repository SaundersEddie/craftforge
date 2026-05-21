PRAGMA foreign_keys = OFF;

DELETE FROM launch_packs;
DELETE FROM products;
DELETE FROM sqlite_sequence WHERE name IN ('products', 'launch_packs');

PRAGMA foreign_keys = ON;

INSERT INTO products (
  id,
  name,
  product_type,
  material,
  dimensions,
  production_time_minutes,
  estimated_cost_cents,
  target_price_cents,
  color_options,
  finish_options,
  customization_rules,
  shipping_notes,
  care_notes,
  photo_notes,
  status
) VALUES
(
  1,
  '3D Printed Bag Clip - Set of 5 One Color',
  '3D Printed Product',
  'PLA',
  '77 x 47 x 8mm each',
  105,
  270,
  1500,
  'One color per set. Random end-of-reel colors may be offered as discounted test sets.',
  'Standard 3D printed finish with visible layer lines.',
  'Custom color requests may be entered when available. Custom requests are printed exactly as entered and are not returnable unless defective.',
  'Ships in a small box with tracking. Buyer should confirm shipping address before purchase.',
  'Keep away from high heat. Wipe clean only. Not dishwasher safe.',
  'Show set of 5, close-up of clip shape, scale photo with bag, color examples, packaging photo.',
  'draft'
),
(
  2,
  'Cedar Squirrel Picnic Table',
  'Woodworking Product',
  'Cedar',
  'Approx. 8 x 7 x 6 inches',
  90,
  450,
  2500,
  'Natural cedar. Finish options may vary by batch.',
  'Sanded cedar with outdoor spar urethane option.',
  'No custom sizing in v0.1. Possible name/text branding later.',
  'Ships assembled or flat-packed depending on final listing version.',
  'Outdoor wood will naturally weather over time. Recoat as needed for longer outdoor life.',
  'Show mounted table, close-up of cedar grain, scale photo, outdoor example, finish detail.',
  'draft'
),
(
  3,
  'Custom Door Handle Tag',
  'Laser / 3D Printed Product',
  'PLA or laser-cut wood depending on variant',
  'Approx. 80 x 170mm with 53mm handle hole',
  75,
  350,
  1200,
  'Background and raised text colors vary by listing option.',
  'Matte, gloss, silk, or sealed wood depending on material.',
  'Custom text is printed exactly as entered. No hateful or offensive text. Custom items are not returnable unless defective.',
  'Ships flat in protective packaging with tracking.',
  'Indoor use recommended unless specifically sold as outdoor-safe.',
  'Show front view, handle fit photo, color options, close-up of text, packaging photo.',
  'draft'
);

INSERT INTO launch_packs (
  id,
  product_id,
  etsy_title,
  short_description,
  long_description,
  etsy_tags_json,
  facebook_post,
  website_blurb,
  photo_checklist_json,
  improvement_notes_json,
  health_score
) VALUES
(
  1,
  1,
  '3D Printed Bag Clip Set - PLA Bag Clips',
  'A practical set of 5 PLA 3D printed bag clips for kitchen, pantry, snacks, coffee, and freezer bags.',
  'This set includes 5 practical 3D printed bag clips made from PLA.\n\nThey are useful for chip bags, coffee bags, pantry items, frozen food bags, and general kitchen storage.\n\nMaterial: PLA\nApproximate size: 77 x 47 x 8mm each\nFinish: Standard 3D printed finish with visible layer lines\n\nKeep away from high heat. Wipe clean only. Not dishwasher safe.',
  '["bag clips","chip clips","3d printed clips","kitchen storage","pantry clips","snack bag clips","pla product","maker made","small batch","practical gift","home accessory","brindle besties","bag closure"]',
  'New from the printer: a set of 5 practical bag clips.\n\nMade from PLA, useful for snacks, coffee, pantry bags, and freezer bags. Simple, useful, and exactly the kind of thing that disappears into daily use.',
  'A set of 5 PLA 3D printed bag clips designed for practical everyday kitchen and pantry use.',
  '["Main product photo on clean background","Photo showing all 5 clips","Close-up of clip shape","Scale photo with bag","Color option photo","Packaging photo"]',
  '["Check final color options before listing","Add any batch-specific color limitations","Confirm shipping box and weight"]',
  90
);
