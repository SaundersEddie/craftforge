CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  material TEXT,
  dimensions TEXT,
  production_time_minutes INTEGER,
  estimated_cost_cents INTEGER,
  target_price_cents INTEGER,
  color_options TEXT,
  finish_options TEXT,
  customization_rules TEXT,
  shipping_notes TEXT,
  care_notes TEXT,
  photo_notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS launch_packs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  etsy_title TEXT,
  short_description TEXT,
  long_description TEXT,
  etsy_tags_json TEXT,
  facebook_post TEXT,
  website_blurb TEXT,
  photo_checklist_json TEXT,
  improvement_notes_json TEXT,
  health_score INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
