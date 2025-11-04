-- 0) Extensions
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- 1) Canonical, user-facing tables
CREATE TABLE catalog.products (
  product_id BIGINT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  brand TEXT,
  part_number TEXT,
  upc_ean_barcode TEXT,
  uom TEXT,
  url_key TEXT,
  product_url TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE catalog.product_offer (
  product_id BIGINT PRIMARY KEY REFERENCES catalog.products(product_id) ON DELETE CASCADE,
  price NUMERIC(18, 6) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  in_stock BOOLEAN NOT NULL,
  qty NUMERIC(18, 6) DEFAULT 0,
  lead_time_days INTEGER
);
CREATE TABLE catalog.categories (
  category_id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  url_key TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE catalog.product_categories (
  product_id BIGINT REFERENCES catalog.products(product_id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES catalog.categories(category_id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);
CREATE TABLE catalog.product_media (
  media_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT REFERENCES catalog.products(product_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (
    role IN ('image', 'small_image', 'thumbnail', 'gallery')
  ),
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  UNIQUE (product_id, role, position)
);
CREATE TABLE catalog.attribute_defs (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('text', 'number', 'boolean')),
  is_facet BOOLEAN NOT NULL DEFAULT TRUE,
  is_search BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE catalog.product_attributes (
  product_id BIGINT REFERENCES catalog.products(product_id) ON DELETE CASCADE,
  code TEXT REFERENCES catalog.attribute_defs(code) ON DELETE RESTRICT,
  value_text TEXT,
  value_num NUMERIC(18, 6),
  value_bool BOOLEAN,
  PRIMARY KEY (product_id, code)
);
-- 2) Search optimization
CREATE TABLE catalog.product_search (
  product_id BIGINT PRIMARY KEY REFERENCES catalog.products(product_id) ON DELETE CASCADE,
  search_text TEXT NOT NULL,
  tsv tsvector
);
CREATE INDEX product_search_tsv_idx ON catalog.product_search USING GIN (tsv);
CREATE INDEX product_search_trgm_idx ON catalog.product_search USING GIN (search_text gin_trgm_ops);
-- Trigger for search text
CREATE OR REPLACE FUNCTION catalog.f_update_tsv() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.tsv := to_tsvector('simple', unaccent(coalesce(NEW.search_text, '')));
RETURN NEW;
END $$;
CREATE TRIGGER trg_product_search_tsv BEFORE
INSERT
  OR
UPDATE OF search_text ON catalog.product_search FOR EACH ROW EXECUTE FUNCTION catalog.f_update_tsv();
-- 3) Safe views for LLM
CREATE VIEW catalog.v_products AS
SELECT p.product_id,
  p.sku,
  p.title,
  p.brand,
  p.part_number,
  p.upc_ean_barcode,
  p.short_description,
  p.description,
  p.url_key,
  p.product_url,
  o.price,
  o.currency,
  o.in_stock,
  o.qty,
  o.lead_time_days,
  p.created_at,
  p.updated_at
FROM catalog.products p
  LEFT JOIN catalog.product_offer o USING (product_id)
WHERE p.is_active;
CREATE VIEW catalog.v_product_categories AS
SELECT pc.product_id,
  c.category_id,
  c.name AS category_name,
  c.url_key AS category_url_key
FROM catalog.product_categories pc
  JOIN catalog.categories c ON c.category_id = pc.category_id
WHERE c.is_active;
CREATE VIEW catalog.v_product_images AS
SELECT product_id,
  role,
  url,
  position
FROM catalog.product_media;
CREATE VIEW catalog.v_product_attributes AS
SELECT pa.product_id,
  pa.code,
  d.label,
  d.data_type,
  pa.value_text,
  pa.value_num,
  pa.value_bool
FROM catalog.product_attributes pa
  JOIN catalog.attribute_defs d ON d.code = pa.code;
CREATE VIEW catalog.v_searchable AS
SELECT p.product_id,
  p.sku,
  p.title,
  p.brand,
  p.part_number,
  o.price,
  o.in_stock,
  s.search_text,
  s.tsv
FROM catalog.products p
  JOIN catalog.product_offer o USING (product_id)
  JOIN catalog.product_search s USING (product_id)
WHERE p.is_active;
-- 4) Indexes
CREATE INDEX ON catalog.products (sku);
CREATE INDEX ON catalog.products (title);
CREATE INDEX ON catalog.product_offer (in_stock);
CREATE INDEX ON catalog.product_offer (price);
CREATE INDEX ON catalog.product_categories (category_id, product_id);
CREATE INDEX ON catalog.product_attributes (code, value_text);