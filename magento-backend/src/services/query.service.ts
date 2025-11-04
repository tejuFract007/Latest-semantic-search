import { Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { DatabaseService } from './database.service';
import { QueryResult } from 'pg';

// Enhanced interfaces - exported
export interface SearchFilters {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  semanticSearch?: boolean;
  similarityThreshold?: number;
  limit?: number;
  page?: number;
}

export interface SearchSession {
  sessionId: string;
  queries: string[];
  filters: SearchFilters[];
  clickedProducts: number[];
  sessionStart: Date;
  lastActivity: Date;
}

// Define the specific search intent type
export type SearchIntent =
  | 'exploratory'
  | 'specific'
  | 'comparison'
  | 'purchase';

export interface EnhancedSearchResult {
  products: any[];
  suggestedSearches: string[];
  relatedCategories: string[];
  searchIntent: SearchIntent;
  summary?: string;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: { query: string; count: number }[];
  searchIntents: { intent: SearchIntent; count: number }[];
  sessionDuration: number;
  clickedProducts: number[];
}

@Injectable()
export class QueryService {
  private readonly logger = new Logger(QueryService.name);
  private openai: OpenAIApi;
  private searchSessions = new Map<string, SearchSession>();
  private searchStatistics = {
    totalSearches: 0,
    popularQueries: new Map<string, number>(),
    searchIntents: new Map<SearchIntent, number>(),
  };

  constructor(private databaseService: DatabaseService) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  /**
   * CORRECTED SCHEMA FOR AI - FIXES THE "price column does not exist" ERROR
   */
  async generateSQL(
    naturalLanguageQuery: string,
  ): Promise<{ sql: string; explanation: string }> {
    const schemaInfo = `
      Database Schema:
      - catalog.products (product_id, sku, title, brand, part_number, short_description, description, url_key, created_at, updated_at, is_active)
      - catalog.product_offer (product_id, price, currency, in_stock, qty, lead_time_days)
      - catalog.categories (category_id, name, is_active)
      - catalog.product_categories (product_id, category_id)
      - catalog.product_media (product_id, role, url, position)
      - catalog.product_search (product_id, search_text, tsv)

      Important Relationships:
      - catalog.products JOIN catalog.product_offer ON products.product_id = product_offer.product_id
      - catalog.products JOIN catalog.product_categories ON products.product_id = product_categories.product_id
      - catalog.product_categories JOIN catalog.categories ON product_categories.category_id = categories.category_id

      Rules:
      - Always join catalog.product_offer to get price, in_stock, and qty
      - Use catalog.product_search for text search capabilities
      - Price filtering must use product_offer.price
      - Stock status must use product_offer.in_stock
      - Use ILIKE for text searches, to_tsvector for full-text search
    `;

    try {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a SQL expert. Convert natural language to PostgreSQL SQL queries. ${schemaInfo}`,
          },
          {
            role: 'user',
            content: `Convert this to SQL: "${naturalLanguageQuery}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const response = completion.data.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Extract SQL from response
      let sql = response;
      const sqlMatch =
        response.match(/```sql\n([\s\S]*?)\n```/) ||
        response.match(/SELECT[\s\S]*?(?=;|$)/i);
      if (sqlMatch) {
        sql = sqlMatch[1] || sqlMatch[0];
      }

      // Ensure SQL ends with semicolon and has LIMIT
      sql = sql.trim();
      if (!sql.endsWith(';')) {
        sql += ';';
      }

      // Add LIMIT if not present
      if (
        !sql.toLowerCase().includes('limit') &&
        !naturalLanguageQuery.toLowerCase().includes('all')
      ) {
        const insertIndex = sql.lastIndexOf(';');
        sql = sql.slice(0, insertIndex) + ' LIMIT 50' + sql.slice(insertIndex);
      }

      return {
        sql: sql,
        explanation: `Generated SQL for: "${naturalLanguageQuery}"`,
      };
    } catch (error) {
      this.logger.error('Error generating SQL:', error);
      throw new Error('Failed to generate SQL query');
    }
  }

  async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    try {
      // Basic safety check
      const lowerSql = sql.toLowerCase();
      const dangerousKeywords = [
        'insert',
        'update',
        'delete',
        'drop',
        'truncate',
        'alter',
        'create',
        'grant',
      ];

      if (dangerousKeywords.some((keyword) => lowerSql.includes(keyword))) {
        throw new Error('Unsafe SQL operation detected');
      }

      const result: QueryResult = await this.databaseService.query(sql, params);
      return result.rows;
    } catch (error) {
      this.logger.error('Error executing query:', error);
      throw error;
    }
  }

  /**
   * ENHANCED SEARCH PRODUCTS - FIXED SCHEMA REFERENCES
   */
  async searchProducts(filters: SearchFilters): Promise<any[]> {
    let query = `
      SELECT 
        p.product_id,
        p.sku,
        p.title,
        p.brand,
        p.part_number,
        p.short_description,
        p.description,
        p.created_at,
        p.updated_at,
        o.price,                
        o.in_stock,                  
        o.qty,                      
        o.lead_time_days,
        STRING_AGG(DISTINCT c.name, ', ') as categories,
        (
          SELECT json_agg(json_build_object('url', pm.url, 'label', pm.role))
          FROM catalog.product_media pm 
          WHERE pm.product_id = p.product_id
          LIMIT 5
        ) as images
      FROM catalog.products p
      LEFT JOIN catalog.product_offer o ON p.product_id = o.product_id
      LEFT JOIN catalog.product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN catalog.categories c ON pc.category_id = c.category_id
      WHERE p.is_active = true
    `;

    const params: any[] = [];
    let paramCount = 0;

    // Search filter
    if (filters.search) {
      paramCount++;
      query += ` AND (
        p.title ILIKE $${paramCount} OR 
        p.brand ILIKE $${paramCount} OR 
        p.part_number ILIKE $${paramCount} OR
        p.short_description ILIKE $${paramCount} OR
        p.description ILIKE $${paramCount}
      )`;
      params.push(`%${filters.search}%`);
    }

    // Brand filter
    if (filters.brand) {
      paramCount++;
      query += ` AND p.brand ILIKE $${paramCount}`;
      params.push(`%${filters.brand}%`);
    }

    // Category filter
    if (filters.category) {
      paramCount++;
      query += ` AND c.name ILIKE $${paramCount}`;
      params.push(`%${filters.category}%`);
    }

    // Price filters
    if (filters.minPrice !== undefined) {
      paramCount++;
      query += ` AND o.price >= $${paramCount}`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      paramCount++;
      query += ` AND o.price <= $${paramCount}`;
      params.push(filters.maxPrice);
    }

    // In stock filter
    if (filters.inStock !== undefined) {
      paramCount++;
      query += ` AND o.in_stock = $${paramCount}`;
      params.push(filters.inStock);
    }

    query += ` GROUP BY p.product_id, o.price, o.in_stock, o.qty, o.lead_time_days`;

    // Add ordering
    query += ` ORDER BY p.created_at DESC`;

    // Add pagination
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    this.logger.log('🔍 Executing Search Query:', query);
    this.logger.log('📋 With Parameters:', params);

    try {
      const result: QueryResult = await this.databaseService.query(
        query,
        params,
      );
      return result.rows;
    } catch (error) {
      this.logger.error('❌ Search Query Error:', error);
      throw error;
    }
  }

  /**
   * SEMANTIC SEARCH USING VECTOR SIMILARITY
   */
  async semanticSearch(
    query: string,
    threshold: number = 0.7,
    limit: number = 20,
  ): Promise<any[]> {
    const semanticQuery = `
      SELECT 
        p.product_id,
        p.sku,
        p.title,
        p.brand,
        p.part_number,
        p.short_description,
        p.description,
        p.created_at,
        p.updated_at,
        o.price,
        o.in_stock,
        o.qty,
        o.lead_time_days,
        STRING_AGG(DISTINCT c.name, ', ') as categories,
        (1 - (ps.tsv <=> plainto_tsquery('english', $1))) as similarity_score
      FROM catalog.products p
      LEFT JOIN catalog.product_offer o ON p.product_id = o.product_id
      LEFT JOIN catalog.product_search ps ON p.product_id = ps.product_id
      LEFT JOIN catalog.product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN catalog.categories c ON pc.category_id = c.category_id
      WHERE (1 - (ps.tsv <=> plainto_tsquery('english', $1))) > $2
        AND p.is_active = true
      GROUP BY p.product_id, o.price, o.in_stock, o.qty, o.lead_time_days, ps.tsv
      ORDER BY similarity_score DESC
      LIMIT $3
    `;

    try {
      const result = await this.databaseService.query(semanticQuery, [
        query,
        threshold,
        limit,
      ]);
      return result.rows;
    } catch (error) {
      this.logger.error('❌ Semantic Search Error:', error);
      // Fallback to keyword search if semantic search fails
      return this.searchProducts({ search: query, limit });
    }
  }

  /**
   * HYBRID SEARCH - COMBINES KEYWORD AND SEMANTIC SEARCH
   */
  async hybridSearch(filters: SearchFilters): Promise<any[]> {
    const {
      search,
      semanticSearch,
      similarityThreshold = 0.7,
      ...otherFilters
    } = filters;

    if (semanticSearch && search) {
      try {
        // Get results from both methods
        const keywordResults = await this.searchProducts({
          ...filters,
          semanticSearch: false,
        });
        const semanticResults = await this.semanticSearch(
          search,
          similarityThreshold,
          filters.limit || 20,
        );

        // Merge and deduplicate results
        const resultsMap = new Map();

        [...semanticResults, ...keywordResults].forEach((item) => {
          if (
            !resultsMap.has(item.product_id) ||
            item.similarity_score >
              (resultsMap.get(item.product_id).similarity_score || 0)
          ) {
            resultsMap.set(item.product_id, item);
          }
        });

        return Array.from(resultsMap.values())
          .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
          .slice(0, filters.limit || 50);
      } catch (error) {
        this.logger.error(
          '❌ Hybrid Search Error, falling back to keyword search:',
          error,
        );
        return this.searchProducts(filters);
      }
    }

    return this.searchProducts(filters);
  }

  /**
   * ENHANCED SEARCH WITH AI-POWERED FEATURES
   */
  async enhancedSearch(filters: SearchFilters): Promise<EnhancedSearchResult> {
    // Track search statistics
    this.trackSearchStatistics(filters);

    const products = await this.hybridSearch(filters);

    // Analyze search intent
    const searchIntent = this.analyzeSearchIntent(filters);

    // Generate suggestions and insights
    const suggestedSearches = await this.generateSearchSuggestions(
      filters,
      products,
    );
    const relatedCategories = await this.findRelatedCategories(products);
    const summary = await this.generateSearchSummary(
      filters,
      products,
      searchIntent,
    );

    return {
      products,
      suggestedSearches,
      relatedCategories,
      searchIntent,
      summary,
    };
  }

  /**
   * SEARCH INTENT ANALYSIS
   */
  private analyzeSearchIntent(filters: SearchFilters): SearchIntent {
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      return 'purchase';
    if (filters.brand || filters.category) return 'specific';
    if (filters.search && filters.search.split(' ').length > 2)
      return 'comparison';
    if (filters.inStock === true) return 'purchase';
    return 'exploratory';
  }

  /**
   * GENERATE SEARCH SUGGESTIONS
   */
  private async generateSearchSuggestions(
    filters: SearchFilters,
    products: any[],
  ): Promise<string[]> {
    const suggestions: string[] = [];

    if (filters.search) {
      // Add related searches based on current query
      const searchTerms = filters.search.toLowerCase().split(' ');
      if (searchTerms.length > 0) {
        suggestions.push(
          `More results for "${filters.search}"`,
          `Best selling ${filters.search}`,
          `${filters.search} under $100`,
          `${filters.search} in stock`,
        );
      }
    }

    if (products.length > 0) {
      // Add suggestions based on found products
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
      const categories = products
        .flatMap((p) => (p.categories ? p.categories.split(', ') : []))
        .filter(Boolean);

      if (brands.length > 0) {
        suggestions.push(`Other products from ${brands[0]}`);
      }

      if (categories.length > 0) {
        suggestions.push(`More ${categories[0]} products`);
      }
    }

    // Add trending suggestions
    suggestions.push(
      'Popular automotive parts',
      'Best rated products',
      'New arrivals',
      'Limited time offers',
    );

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  /**
   * FIND RELATED CATEGORIES
   */
  private async findRelatedCategories(products: any[]): Promise<string[]> {
    if (products.length === 0) return [];

    const categorySet = new Set<string>();

    products.forEach((product) => {
      if (product.categories) {
        product.categories.split(', ').forEach((cat: string) => {
          if (cat && cat !== 'null') categorySet.add(cat);
        });
      }
    });

    return Array.from(categorySet).slice(0, 6);
  }

  /**
   * GENERATE SEARCH SUMMARY
   */
  private async generateSearchSummary(
    filters: SearchFilters,
    products: any[],
    intent: SearchIntent,
  ): Promise<string> {
    const productCount = products.length;

    if (productCount === 0) {
      return 'No products found matching your criteria. Try broadening your search or checking different filters.';
    }

    const priceRange = products.reduce(
      (acc, product) => {
        if (product.price) {
          acc.min = Math.min(acc.min, product.price);
          acc.max = Math.max(acc.max, product.price);
        }
        return acc;
      },
      { min: Infinity, max: -Infinity },
    );

    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

    let summary = `Found ${productCount} products `;

    if (filters.search) {
      summary += `for "${filters.search}" `;
    }

    if (brands.length > 0 && brands.length <= 3) {
      summary += `from ${brands.join(', ')} `;
    }

    if (priceRange.min !== Infinity) {
      summary += `priced from $${priceRange.min.toFixed(
        2,
      )} to $${priceRange.max.toFixed(2)}`;
    }

    if (intent === 'purchase') {
      summary +=
        '. These products are ready for purchase with current pricing and availability.';
    } else if (intent === 'comparison') {
      summary +=
        '. Compare features and specifications to find the best match for your needs.';
    }

    return summary;
  }

  /**
   * SEARCH SESSION MANAGEMENT
   */
  async trackSearch(
    sessionId: string,
    filters: SearchFilters,
    results: any[],
  ): Promise<void> {
    if (!this.searchSessions.has(sessionId)) {
      this.searchSessions.set(sessionId, {
        sessionId,
        queries: [],
        filters: [],
        clickedProducts: [],
        sessionStart: new Date(),
        lastActivity: new Date(),
      });
    }

    const session = this.searchSessions.get(sessionId);
    if (!session) return;

    if (filters.search) session.queries.push(filters.search);
    session.filters.push(filters);
    session.lastActivity = new Date();

    // Clean up old sessions (older than 24 hours)
    this.cleanupOldSessions();
  }

  /**
   * PERSONALIZED SUGGESTIONS
   */
  async getPersonalizedSuggestions(sessionId: string): Promise<string[]> {
    const session = this.searchSessions.get(sessionId);
    if (!session) return [];

    const recentQueries = session.queries.slice(-3);

    if (recentQueries.length > 0) {
      const lastQuery = recentQueries[recentQueries.length - 1];
      return [
        `More results for "${lastQuery}"`,
        `Related to "${lastQuery}"`,
        `Best selling in ${lastQuery}`,
        `${lastQuery} accessories`,
      ];
    }

    return [];
  }

  /**
   * SEARCH ANALYTICS
   */
  async getSearchAnalytics(sessionId: string): Promise<SearchAnalytics> {
    const session = this.searchSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const sessionDuration = Date.now() - session.sessionStart.getTime();

    // Fix the reduce method with proper typing
    const searchIntents = session.filters.reduce<
      { intent: SearchIntent; count: number }[]
    >((acc, filter) => {
      const intent = this.analyzeSearchIntent(filter);
      const existing = acc.find((item) => item.intent === intent);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ intent, count: 1 });
      }
      return acc;
    }, []);

    return {
      totalSearches: session.queries.length,
      popularQueries: this.getPopularQueriesFromSession(session),
      searchIntents,
      sessionDuration,
      clickedProducts: session.clickedProducts,
    };
  }

  /**
   * SEARCH STATISTICS
   */
  async getSearchStatistics(): Promise<any> {
    return {
      totalSearches: this.searchStatistics.totalSearches,
      popularQueries: Array.from(this.searchStatistics.popularQueries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count })),
      searchIntents: Array.from(
        this.searchStatistics.searchIntents.entries(),
      ).map(([intent, count]) => ({ intent, count })),
      activeSessions: this.searchSessions.size,
    };
  }

  /**
   * TRENDING SEARCHES
   */
  async getTrendingSearches(): Promise<string[]> {
    const popular = Array.from(this.searchStatistics.popularQueries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([query]) => query);

    // Fallback trending searches if no data
    if (popular.length === 0) {
      return [
        'britezone display',
        '00200 parts',
        'hydraulic tools',
        'automotive accessories',
        'compressor units',
        'tire pumps',
        'electrical components',
        'maintenance kits',
      ];
    }

    return popular;
  }

  /**
   * QUERY SUGGESTIONS
   */
  async generateQuerySuggestions(query: string): Promise<string[]> {
    // Find similar queries from search history
    const similarQueries = Array.from(
      this.searchStatistics.popularQueries.keys(),
    )
      .filter(
        (q) => q.toLowerCase().includes(query.toLowerCase()) && q !== query,
      )
      .slice(0, 5);

    return similarQueries.length > 0
      ? similarQueries
      : [
          `${query} under $100`,
          `${query} in stock`,
          `best ${query}`,
          `${query} accessories`,
        ];
  }

  /**
   * HELPER METHODS
   */
  private trackSearchStatistics(filters: SearchFilters): void {
    this.searchStatistics.totalSearches++;

    if (filters.search) {
      const count =
        this.searchStatistics.popularQueries.get(filters.search) || 0;
      this.searchStatistics.popularQueries.set(filters.search, count + 1);
    }

    const intent = this.analyzeSearchIntent(filters);
    const intentCount = this.searchStatistics.searchIntents.get(intent) || 0;
    this.searchStatistics.searchIntents.set(intent, intentCount + 1);
  }

  private cleanupOldSessions(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const [sessionId, session] of this.searchSessions.entries()) {
      if (session.lastActivity < twentyFourHoursAgo) {
        this.searchSessions.delete(sessionId);
      }
    }
  }

  private getPopularQueriesFromSession(
    session: SearchSession,
  ): { query: string; count: number }[] {
    const queryCounts = new Map<string, number>();

    session.queries.forEach((query) => {
      const count = queryCounts.get(query) || 0;
      queryCounts.set(query, count + 1);
    });

    return Array.from(queryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));
  }

  // Helper method to get brands
  async getBrands(): Promise<string[]> {
    const result: QueryResult = await this.databaseService.query(
      'SELECT DISTINCT brand FROM catalog.products WHERE brand IS NOT NULL ORDER BY brand LIMIT 100',
    );
    return result.rows.map((row) => row.brand);
  }

  // Helper method to get categories
  async getCategories(): Promise<string[]> {
    const result: QueryResult = await this.databaseService.query(
      'SELECT DISTINCT name FROM catalog.categories WHERE is_active = true ORDER BY name LIMIT 100',
    );
    return result.rows.map((row) => row.name);
  }
}
