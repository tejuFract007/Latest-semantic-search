import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { readFileSync } from 'fs';
import { DatabaseService } from './database.service';
import { QueryResult } from 'pg';

// Define interfaces for type safety
interface ProductAttributes {
  [key: string]: any;
  title?: string;
  brand?: string;
  part_number?: string;
  bar_code?: string;
  upc?: string;
  short_description?: string;
  description_2?: string;
  description?: string;
  url_key?: string;
  category_ids?: number[];
}

interface CleanedProduct {
  product_id: any;
  sku: any;
  name: any;
  title: any;
  price: any;
  status: any;
  weight: any;
  type_id: any;
  visibility: any;
  created_at: Date;
  updated_at: Date;
  brand: any;
  part_number: any;
  upc_ean_barcode: any;
  short_description: any;
  description: any;
  url_key: any;
  product_url: any;
  in_stock: boolean;
  qty: any;
  category_ids: any[];
  media_gallery: any[];
  attributes: ProductAttributes;
}

interface Category {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  is_active: boolean;
  product_count: number;
  path: string;
}

interface Attribute {
  attribute_code: string;
  attribute_id: number;
  frontend_label?: string;
  default_frontend_label?: string;
  frontend_input: string;
  is_filterable?: boolean;
  is_searchable?: string;
  options?: any[];
}

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(private databaseService: DatabaseService) {}

  /**
   * STEP 1: Saare categories extract karo product data se
   */
  private async extractAllCategoryIds(): Promise<number[]> {
    const filePath = process.env.NDJSON_FILE;
    if (!filePath) {
      throw new Error('NDJSON_FILE environment variable not set');
    }

    const stream = createReadStream(filePath, { encoding: 'utf8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    const allCategoryIds = new Set<number>();
    let lineCount = 0;

    this.logger.log('📂 Reading product file to extract categories...');

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const product = JSON.parse(trimmed);

        // METHOD 1: Check category_links first
        if (product.extension_attributes?.category_links) {
          product.extension_attributes.category_links.forEach((link: any) => {
            const numId = parseInt(link.category_id);
            if (!isNaN(numId)) {
              allCategoryIds.add(numId);
            }
          });
        }

        // METHOD 2: Check custom_attributes se category_ids (YEH FIX HAI)
        const customAttributes = product.custom_attributes || [];
        const categoryAttr = customAttributes.find(
          (attr: any) => attr.attribute_code === 'category_ids',
        );
        if (categoryAttr && categoryAttr.value) {
          const categoryIds = Array.isArray(categoryAttr.value)
            ? categoryAttr.value
            : JSON.parse(categoryAttr.value || '[]');

          categoryIds.forEach((id) => {
            const numId = parseInt(id);
            if (!isNaN(numId)) {
              allCategoryIds.add(numId);
            }
          });
        }

        lineCount++;
        if (lineCount % 5000 === 0) {
          this.logger.log(
            `📊 Processed ${lineCount} products, found ${allCategoryIds.size} categories so far...`,
          );
        }
      } catch (error) {
        // Chhod do invalid lines ko
      }
    }

    this.logger.log(
      `✅ Total ${allCategoryIds.size} unique categories found in ${lineCount} products`,
    );
    return Array.from(allCategoryIds);
  }

  /**
   * STEP 2: Saare categories database mein daalo
   */
  private async insertAllCategories(categoryIds: number[]): Promise<number> {
    this.logger.log(
      `🔄 Inserting ${categoryIds.length} categories into database...`,
    );
    let insertedCategories = 0;

    for (const categoryId of categoryIds) {
      try {
        await this.databaseService.query(
          `INSERT INTO catalog.categories (category_id, name, is_active) 
           VALUES ($1, $2, $3) ON CONFLICT (category_id) DO NOTHING`,
          [categoryId, `Category ${categoryId}`, true],
        );
        insertedCategories++;

        // Progress dikhao
        if (insertedCategories % 100 === 0) {
          this.logger.log(
            `📈 Inserted ${insertedCategories}/${categoryIds.length} categories...`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Failed to insert category ${categoryId}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `✅ Successfully inserted ${insertedCategories} categories`,
    );
    return insertedCategories;
  }

  /**
   * MAIN METHOD: Sab kuch process karo
   */
  async processAllData(): Promise<{ categories: number; products: number }> {
    try {
      // STEP 1: Saare categories extract karo
      this.logger.log(
        '🔄 Step 1: Extracting all categories from product data...',
      );
      const categoryIds = await this.extractAllCategoryIds();

      // STEP 2: Saare categories database mein daalo
      const insertedCategories = await this.insertAllCategories(categoryIds);

      // STEP 3: Ab products process karo
      this.logger.log('🔄 Step 3: Now processing products...');
      const processedProducts = await this.processProducts();

      return {
        categories: insertedCategories,
        products: processedProducts.processed,
      };
    } catch (error) {
      this.logger.error('❌ Error in processAllData:', error);
      throw error;
    }
  }

  private extractAttributes(customAttributes: any[] = []): ProductAttributes {
    const attributes: ProductAttributes = {};
    customAttributes.forEach((attr) => {
      attributes[attr.attribute_code] = attr.value;
    });
    return attributes;
  }

  private cleanProductData(rawProduct: any): any {
    const attributes = this.extractAttributes(
      rawProduct.custom_attributes || [],
    );
    const stockItem = rawProduct.extension_attributes?.stock_item || {};

    // Handle missing fields safely
    return {
      // Main product fields
      product_id: rawProduct.id,
      sku: rawProduct.sku || `UNKNOWN_${rawProduct.id}`,
      title: rawProduct.name || 'Unknown Product',
      short_description:
        attributes.short_description || attributes.description_2 || '',
      description: attributes.description || '',
      brand: attributes.brand || rawProduct.pmtSupplierCode || 'Unknown Brand',
      part_number: attributes.part_number || rawProduct.pmtPartNumber || '',
      upc_ean_barcode: attributes.bar_code || '',
      uom:
        attributes.selling_unit_of_measure ||
        attributes.unit_of_measure ||
        'EACH',
      url_key: attributes.url_key || '',
      product_url: rawProduct.extension_attributes?.product_url || '',
      created_at: rawProduct.created_at
        ? new Date(rawProduct.created_at)
        : new Date(),
      updated_at: rawProduct.updated_at
        ? new Date(rawProduct.updated_at)
        : new Date(),

      // Offer fields
      price: rawProduct.price || 0,
      in_stock: !!stockItem.is_in_stock,
      qty: stockItem.qty || 0,
      lead_time_days: attributes.lead_time_days || null,

      // Relationships
      category_ids:
        rawProduct.extension_attributes?.category_links?.map(
          (cl: any) => cl.category_id,
        ) || [],
      media_gallery: rawProduct.media_gallery_entries || [],
      attributes: attributes,
    };
  }

  async loadCategories(): Promise<void> {
    try {
      const categoryFile = process.env.CATEGORY_FILE;
      if (!categoryFile) {
        throw new Error('CATEGORY_FILE environment variable is not set');
      }

      const categoriesData = JSON.parse(readFileSync(categoryFile, 'utf8'));

      const categories = this.flattenCategories(categoriesData);

      for (const category of categories) {
        await this.databaseService.query(
          `INSERT INTO catalog.categories (category_id, name, parent_id, level, is_active, product_count, path)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (category_id) DO UPDATE SET
             name = EXCLUDED.name,
             parent_id = EXCLUDED.parent_id,
             level = EXCLUDED.level,
             product_count = EXCLUDED.product_count,
             path = EXCLUDED.path`,
          [
            category.id,
            category.name,
            category.parent_id,
            category.level,
            category.is_active,
            category.product_count,
            category.path,
          ],
        );
      }

      this.logger.log(`Loaded ${categories.length} categories`);
    } catch (error) {
      this.logger.error('Error loading categories:', error);
    }
  }

  private flattenCategories(
    categoryData: any,
    parentId: number = 0,
    level: number = 0,
    path: string = '',
  ): Category[] {
    let categories: Category[] = [];
    const currentPath = path
      ? `${path}/${categoryData.name}`
      : categoryData.name;

    categories.push({
      id: categoryData.id,
      name: categoryData.name,
      parent_id: parentId,
      level: level,
      is_active: categoryData.is_active !== false,
      product_count: categoryData.product_count || 0,
      path: currentPath,
    });

    if (categoryData.children_data && categoryData.children_data.length > 0) {
      categoryData.children_data.forEach((child: any) => {
        const childCategories = this.flattenCategories(
          child,
          categoryData.id,
          level + 1,
          currentPath,
        );
        categories = categories.concat(childCategories);
      });
    }

    return categories;
  }

  async loadAttributes(): Promise<void> {
    try {
      const attributeFile = process.env.ATTRIBUTE_FILE;
      if (!attributeFile) {
        throw new Error('ATTRIBUTE_FILE environment variable is not set');
      }

      const attributesData = JSON.parse(readFileSync(attributeFile, 'utf8'));

      const items: Attribute[] = attributesData.items || [];

      for (const attr of items) {
        await this.databaseService.query(
          `INSERT INTO catalog.attribute_defs (attribute_code, attribute_id, frontend_label, frontend_input, is_filterable, is_searchable, options)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (attribute_code) DO UPDATE SET
             frontend_label = EXCLUDED.frontend_label,
             frontend_input = EXCLUDED.frontend_input,
             is_filterable = EXCLUDED.is_filterable,
             is_searchable = EXCLUDED.is_searchable,
             options = EXCLUDED.options`,
          [
            attr.attribute_code,
            attr.attribute_id,
            attr.frontend_label || attr.default_frontend_label,
            attr.frontend_input,
            attr.is_filterable || false,
            attr.is_searchable === '1',
            JSON.stringify(attr.options || []),
          ],
        );
      }

      this.logger.log(`Loaded ${items.length} attributes`);
    } catch (error) {
      this.logger.error('Error loading attributes:', error);
    }
  }

  async processProducts(): Promise<{ processed: number }> {
    const filePath = process.env.NDJSON_FILE;
    if (!filePath) {
      throw new Error('NDJSON_FILE environment variable is not set');
    }

    const batchSize = parseInt(process.env.BATCH_SIZE || '100');

    const stream = createReadStream(filePath, { encoding: 'utf8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    let batch: any[] = [];
    let processed = 0;
    let failed = 0;

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const rawProduct = JSON.parse(trimmed);

        // Skip products that are causing issues
        if (!rawProduct.id || !rawProduct.sku) {
          this.logger.warn(`Skipping invalid product: ${rawProduct.id}`);
          continue;
        }

        const cleanProduct = this.cleanProductData(rawProduct);
        batch.push(cleanProduct);

        if (batch.length >= batchSize) {
          await this.processBatch(batch);
          processed += batch.length;
          this.logger.log(
            `Processed ${processed} products... (Failed: ${failed})`,
          );
          batch = [];
        }
      } catch (error) {
        failed++;
        this.logger.error('Error parsing product, skipping:', error);
      }
    }

    if (batch.length > 0) {
      await this.processBatch(batch);
      processed += batch.length;
    }

    this.logger.log(
      `✅ Completed processing ${processed} products (Failed: ${failed})`,
    );
    return { processed };
  }

  private async insertWhitelistedAttributes(product: any): Promise<void> {
    const whitelist = {
      color: 'text',
      buy_pack: 'number',
      unit_of_measure: 'text',
      selling_unit_of_measure: 'text',
      core_charge: 'number',
      lead_time_days: 'number',
    };

    for (const [code, dataType] of Object.entries(whitelist)) {
      if (product.attributes[code]) {
        // Ensure attribute definition exists
        await this.databaseService.query(
          `INSERT INTO catalog.attribute_defs (code, label, data_type, is_facet, is_search)
         VALUES ($1, $2, $3, true, true) ON CONFLICT (code) DO NOTHING`,
          [code, code.replace('_', ' ').toUpperCase(), dataType],
        );

        // Insert product attribute
        let query = '';
        let params = [product.product_id, code];

        if (dataType === 'text') {
          query = `INSERT INTO catalog.product_attributes (product_id, code, value_text) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`;
          params.push(String(product.attributes[code]));
        } else if (dataType === 'number') {
          query = `INSERT INTO catalog.product_attributes (product_id, code, value_num) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`;
          params.push(parseFloat(product.attributes[code]) || 0);
        }

        if (query) {
          await this.databaseService.query(query, params);
        }
      }
    }
  }

  private async processBatch(products: any[]): Promise<void> {
    for (const product of products) {
      try {
        // 1. Insert main product
        await this.databaseService.query(
          `INSERT INTO catalog.products (
          product_id, sku, title, short_description, description, brand, 
          part_number, upc_ean_barcode, uom, url_key, product_url, created_at, updated_at, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (product_id) DO UPDATE SET
          sku=EXCLUDED.sku, title=EXCLUDED.title, short_description=EXCLUDED.short_description,
          description=EXCLUDED.description, brand=EXCLUDED.brand, part_number=EXCLUDED.part_number,
          upc_ean_barcode=EXCLUDED.upc_ean_barcode, uom=EXCLUDED.uom, updated_at=EXCLUDED.updated_at`,
          [
            product.product_id,
            product.sku,
            product.title,
            product.short_description,
            product.description,
            product.brand,
            product.part_number,
            product.upc_ean_barcode,
            product.uom,
            product.url_key,
            product.product_url,
            product.created_at,
            product.updated_at,
            true, // is_active
          ],
        );

        // 2. Insert product offer
        await this.databaseService.query(
          `INSERT INTO catalog.product_offer (product_id, price, currency, in_stock, qty, lead_time_days)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (product_id) DO UPDATE SET
           price=EXCLUDED.price, in_stock=EXCLUDED.in_stock, qty=EXCLUDED.qty, lead_time_days=EXCLUDED.lead_time_days`,
          [
            product.product_id,
            product.price,
            'USD', // Add currency
            product.in_stock,
            product.qty,
            product.lead_time_days,
          ],
        );

        // 3. Build and insert search text
        const searchText = [
          product.title,
          product.brand,
          product.part_number,
          product.upc_ean_barcode,
          product.short_description,
          product.description,
        ]
          .filter(Boolean)
          .join(' ');

        await this.databaseService.query(
          `INSERT INTO catalog.product_search (product_id, search_text)
         VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET search_text=EXCLUDED.search_text`,
          [product.product_id, searchText],
        );

        // 4. Insert categories - AB ERROR NAHI AAYEGA!
        for (const categoryId of product.category_ids || []) {
          try {
            // Direct insert karo - categories already exist karti hain
            await this.databaseService.query(
              `INSERT INTO catalog.product_categories (product_id, category_id) 
               VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [product.product_id, categoryId],
            );
          } catch (error) {
            this.logger.warn(
              `Failed to insert category ${categoryId} for product ${product.product_id}`,
            );
          }
        }

        // 5. Insert media
        for (const media of product.media_gallery || []) {
          try {
            const role =
              media.types && media.types.length > 0
                ? media.types[0]
                : 'gallery';
            await this.databaseService.query(
              `INSERT INTO catalog.product_media (product_id, role, url, position)
             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
              [product.product_id, role, media.file, media.position || 0],
            );
          } catch (error) {
            this.logger.warn(
              `Failed to insert media for product ${product.product_id}`,
            );
          }
        }

        // 6. Insert whitelisted attributes
        try {
          await this.insertWhitelistedAttributes(product);
        } catch (error) {
          this.logger.warn(
            `Failed to insert attributes for product ${product.product_id}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed processing product ${product.product_id}:`,
          error,
        );
        // Continue with next product instead of stopping entire batch
      }
    }
  }

  async getStats(): Promise<{
    totalProducts: number;
    totalCategories: number;
    sampleBrands: string[];
  }> {
    const productsCount: QueryResult = await this.databaseService.query(
      'SELECT COUNT(*) as count FROM catalog.products WHERE is_active = true',
    );

    const categoriesCount: QueryResult = await this.databaseService.query(
      'SELECT COUNT(*) as count FROM catalog.categories WHERE is_active = true',
    );

    const brands: QueryResult = await this.databaseService.query(
      'SELECT DISTINCT brand FROM catalog.products WHERE brand IS NOT NULL LIMIT 10',
    );

    return {
      totalProducts: parseInt(productsCount.rows[0].count),
      totalCategories: parseInt(categoriesCount.rows[0].count),
      sampleBrands: brands.rows.map((r: any) => r.brand),
    };
  }
}
