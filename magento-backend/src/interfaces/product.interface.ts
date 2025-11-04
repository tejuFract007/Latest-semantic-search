// Product Interfaces for TypeScript Type Safety

// Main Product Interface
export interface Product {
  product_id: number;
  sku: string;
  name: string;
  title?: string;
  price: number;
  status: number;
  weight: number;
  type_id: string;
  visibility: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;

  // Cleaned fields
  brand?: string;
  part_number?: string;
  upc_ean_barcode?: string;
  short_description?: string;
  description?: string;
  url_key?: string;
  product_url?: string;

  // Stock info
  in_stock: boolean;
  qty: number;

  // Search optimization
  search_text?: any; // TSVECTOR type
}

// Raw Magento Product Interface (from NDJSON)
export interface RawMagentoProduct {
  id: number;
  sku: string;
  name: string;
  price: number;
  status: number;
  weight: number;
  type_id: string;
  visibility: number;
  created_at: string;
  updated_at: string;
  custom_attributes: MagentoAttribute[];
  extension_attributes: {
    stock_item?: {
      is_in_stock: boolean;
      qty: number;
    };
    category_links?: Array<{
      category_id: number;
      position: number;
    }>;
    product_url?: string;
  };
  media_gallery_entries: MagentoMedia[];
  pmtSupplierCode?: string;
  pmtPartNumber?: string;
}

// Magento Attribute Interface
export interface MagentoAttribute {
  attribute_code: string;
  value: any;
}

// Magento Media Interface
export interface MagentoMedia {
  id: number;
  file: string;
  label?: string;
  types: string[];
  disabled: boolean;
  position: number;
  media_type: string;
}

// Cleaned Product Interface (after processing)
export interface CleanedProduct {
  product_id: number;
  sku: string;
  name: string;
  title: string;
  price: number;
  status: number;
  weight: number;
  type_id: string;
  visibility: number;
  created_at: Date;
  updated_at: Date;

  // Cleaned fields
  brand?: string;
  part_number?: string;
  upc_ean_barcode?: string;
  short_description?: string;
  description?: string;
  url_key?: string;
  product_url?: string;

  // Stock info
  in_stock: boolean;
  qty: number;

  // Relationships
  category_ids: number[];
  media_gallery: MagentoMedia[];
  attributes: Record<string, any>;
}

// Category Interface
export interface Category {
  category_id: number;
  name: string;
  parent_id?: number;
  level: number;
  is_active: boolean;
  product_count: number;
  path?: string;
  created_at: Date;
}

// Product Category Relationship
export interface ProductCategory {
  product_id: number;
  category_id: number;
}

// Attribute Definition Interface
export interface AttributeDef {
  attribute_code: string;
  attribute_id: number;
  frontend_label: string;
  frontend_input: string;
  is_filterable: boolean;
  is_searchable: boolean;
  options: any[];
  created_at: Date;
}

// Product Attribute Interface
export interface ProductAttribute {
  id?: number;
  product_id: number;
  attribute_code: string;
  value_text?: string;
  value_numeric?: number;
  value_boolean?: boolean;
  created_at: Date;
}

// Product Media Interface
export interface ProductMedia {
  media_id?: number;
  product_id: number;
  url: string;
  label?: string;
  position: number;
  media_type: string;
  is_disabled: boolean;
}

// Search Filters Interface
export interface SearchFilters {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
  page?: number;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProcessProductsResponse {
  processed: number;
  message: string;
}

export interface StatsResponse {
  totalProducts: number;
  totalCategories: number;
  sampleBrands: string[];
}

// AI Query Interfaces
export interface NaturalLanguageQuery {
  query: string;
}

export interface GeneratedSQL {
  sql: string;
  explanation: string;
}

export interface QueryResult {
  success: boolean;
  naturalQuery: string;
  generatedSQL: string;
  explanation: string;
  results: any[];
  count: number;
  error?: string;
}

// Database Result Interface
export interface DatabaseQueryResult {
  rows: any[];
  rowCount?: number;
  command?: string;
  oid?: number;
  fields?: any[];
}
