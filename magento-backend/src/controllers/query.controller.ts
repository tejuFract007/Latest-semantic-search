// import { Controller, Post, Body, Get, Query } from '@nestjs/common';
// import { QueryService } from '../services/query.service';

// @Controller('query')
// export class QueryController {
//   constructor(private readonly queryService: QueryService) {}

//   @Post('natural')
//   async naturalLanguageQuery(@Body() body: { query: string }) {
//     try {
//       const { sql, explanation } = await this.queryService.generateSQL(
//         body.query,
//       );
//       const results = await this.queryService.executeQuery(sql);

//       return {
//         success: true,
//         naturalQuery: body.query,
//         generatedSQL: sql,
//         explanation,
//         results,
//         count: results.length,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         naturalQuery: body.query,
//       };
//     }
//   }

//   @Get('search')
//   async searchProducts(
//     @Query('q') search: string,
//     @Query('brand') brand: string,
//     @Query('category') category: string,
//     @Query('minPrice') minPrice: string,
//     @Query('maxPrice') maxPrice: string,
//     @Query('inStock') inStock: string,
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//   ) {
//     const filters = {
//       search,
//       brand,
//       category,
//       minPrice: minPrice ? parseFloat(minPrice) : undefined,
//       maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
//       inStock: inStock ? inStock === 'true' : undefined,
//       page: page ? parseInt(page) : 1,
//       limit: limit ? parseInt(limit) : 20,
//     };

//     const results = await this.queryService.searchProducts(filters);
//     return {
//       success: true,
//       filters,
//       results,
//       count: results.length,
//     };
//   }

//   @Get('brands')
//   async getBrands() {
//     const result = await this.queryService.executeQuery(
//       'SELECT DISTINCT brand FROM catalog.products WHERE brand IS NOT NULL ORDER BY brand LIMIT 100',
//     );
//     return result.map((row) => row.brand);
//   }

//   @Get('categories')
//   async getCategories() {
//     const result = await this.queryService.executeQuery(
//       'SELECT DISTINCT name FROM catalog.categories WHERE is_active = true ORDER BY name LIMIT 100',
//     );
//     return result.map((row) => row.name);
//   }
// }

// import { Controller, Post, Body, Get, Query } from '@nestjs/common';
// import { QueryService } from '../services/query.service';
// import {
//   EnhancedSearchResult,
//   SearchAnalytics,
// } from '../services/query.service';

// @Controller('query')
// export class QueryController {
//   constructor(private readonly queryService: QueryService) {}

//   @Post('natural')
//   async naturalLanguageQuery(@Body() body: { query: string }) {
//     try {
//       const { sql, explanation } = await this.queryService.generateSQL(
//         body.query,
//       );
//       const results = await this.queryService.executeQuery(sql);

//       return {
//         success: true,
//         naturalQuery: body.query,
//         generatedSQL: sql,
//         explanation,
//         results,
//         count: results.length,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         naturalQuery: body.query,
//       };
//     }
//   }

//   @Get('search')
//   async searchProducts(
//     @Query('search') search: string,
//     @Query('brand') brand: string,
//     @Query('category') category: string,
//     @Query('minPrice') minPrice: string,
//     @Query('maxPrice') maxPrice: string,
//     @Query('inStock') inStock: string,
//     @Query('semantic') semantic: string,
//     @Query('similarity') similarity: string,
//     @Query('sessionId') sessionId: string,
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//   ) {
//     try {
//       const filters = {
//         search,
//         brand,
//         category,
//         minPrice: minPrice ? parseFloat(minPrice) : undefined,
//         maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
//         inStock: inStock ? inStock === 'true' : undefined,
//         semanticSearch: semantic === 'true',
//         similarityThreshold: similarity ? parseFloat(similarity) : 0.7,
//         page: page ? parseInt(page) : 1,
//         limit: limit ? parseInt(limit) : 20,
//       };

//       let results: any;
//       let products: any[];

//       // Use enhanced search if semantic search is enabled
//       if (filters.semanticSearch) {
//         const enhancedResults = await this.queryService.enhancedSearch(filters);
//         results = enhancedResults;
//         products = enhancedResults.products;
//       } else {
//         products = await this.queryService.searchProducts(filters);
//         results = { products };
//       }

//       // Track search session for personalization
//       if (sessionId) {
//         await this.queryService.trackSearch(sessionId, filters, products);
//       }

//       return {
//         success: true,
//         sessionId: sessionId || this.generateSessionId(),
//         filters,
//         ...results,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         filters: { search, brand, category, minPrice, maxPrice, inStock },
//       };
//     }
//   }

//   @Get('enhanced-search')
//   async enhancedSearch(
//     @Query('q') search: string,
//     @Query('brand') brand: string,
//     @Query('category') category: string,
//     @Query('minPrice') minPrice: string,
//     @Query('maxPrice') maxPrice: string,
//     @Query('inStock') inStock: string,
//     @Query('sessionId') sessionId: string,
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//   ) {
//     try {
//       const filters = {
//         search,
//         brand,
//         category,
//         minPrice: minPrice ? parseFloat(minPrice) : undefined,
//         maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
//         inStock: inStock ? inStock === 'true' : undefined,
//         semanticSearch: true,
//         page: page ? parseInt(page) : 1,
//         limit: limit ? parseInt(limit) : 20,
//       };

//       const results = await this.queryService.enhancedSearch(filters);

//       // Track search session
//       if (sessionId) {
//         await this.queryService.trackSearch(
//           sessionId,
//           filters,
//           results.products,
//         );
//       }

//       return {
//         success: true,
//         sessionId: sessionId || this.generateSessionId(),
//         ...results,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('semantic-search')
//   async semanticSearch(
//     @Query('q') query: string,
//     @Query('similarity') similarity: string,
//     @Query('limit') limit: string,
//   ) {
//     try {
//       const threshold = similarity ? parseFloat(similarity) : 0.7;
//       const results = await this.queryService.semanticSearch(
//         query,
//         threshold,
//         limit ? parseInt(limit) : 20,
//       );

//       return {
//         success: true,
//         query,
//         similarityThreshold: threshold,
//         results,
//         count: results.length,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('search-suggestions')
//   async getSearchSuggestions(
//     @Query('q') query: string,
//     @Query('sessionId') sessionId: string,
//   ) {
//     try {
//       let suggestions: string[] = [];

//       // Get personalized suggestions if session exists
//       if (sessionId) {
//         const personalizedSuggestions =
//           await this.queryService.getPersonalizedSuggestions(sessionId);
//         suggestions = [...suggestions, ...personalizedSuggestions];
//       }

//       // Add query-based suggestions
//       if (query) {
//         const querySuggestions =
//           await this.queryService.generateQuerySuggestions(query);
//         suggestions = [...suggestions, ...querySuggestions];
//       }

//       // Add trending searches if no specific suggestions
//       if (suggestions.length === 0) {
//         const trendingSearches = await this.queryService.getTrendingSearches();
//         suggestions = [...suggestions, ...trendingSearches];
//       }

//       return {
//         success: true,
//         query,
//         sessionId,
//         suggestions: suggestions.slice(0, 10), // Limit to 10 suggestions
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('search-analytics')
//   async getSearchAnalytics(@Query('sessionId') sessionId: string): Promise<{
//     success: boolean;
//     sessionId?: string;
//     analytics?: any;
//     error?: string;
//   }> {
//     try {
//       if (!sessionId) {
//         return {
//           success: false,
//           error: 'Session ID is required',
//         };
//       }

//       const analytics = await this.queryService.getSearchAnalytics(sessionId);
//       return {
//         success: true,
//         sessionId,
//         analytics,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('brands')
//   async getBrands() {
//     try {
//       const result = await this.queryService.executeQuery(
//         'SELECT DISTINCT brand FROM catalog.products WHERE brand IS NOT NULL ORDER BY brand LIMIT 100',
//       );
//       return {
//         success: true,
//         brands: result.map((row) => row.brand),
//         count: result.length,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('categories')
//   async getCategories() {
//     try {
//       const result = await this.queryService.executeQuery(
//         'SELECT DISTINCT name FROM catalog.categories WHERE is_active = true ORDER BY name LIMIT 100',
//       );
//       return {
//         success: true,
//         categories: result.map((row) => row.name),
//         count: result.length,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   @Get('search-stats')
//   async getSearchStats() {
//     try {
//       const stats = await this.queryService.getSearchStatistics();
//       return {
//         success: true,
//         stats,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   // Helper method to generate session ID
//   private generateSessionId(): string {
//     return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }
// }

import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { QueryService } from '../services/query.service';

@Controller('query')
export class QueryController {
  private readonly logger = new Logger(QueryController.name);

  constructor(private readonly queryService: QueryService) {}

  /**
   * 🧠 Natural Language → SQL + Execute Query
   * POST /query/natural
   */
  @Post('natural')
  async naturalLanguageQuery(@Body() body: { query: string }) {
    try {
      const { sql, explanation } = await this.queryService.generateSQL(
        body.query,
      );
      const results = await this.queryService.executeQuery(sql);

      return {
        success: true,
        naturalQuery: body.query,
        generatedSQL: sql,
        explanation,
        results,
        count: results.length,
      };
    } catch (error) {
      this.logger.error('❌ Error in natural query:', error.message);
      return { success: false, error: error.message, naturalQuery: body.query };
    }
  }

  /**
   * 🔍 Standard + Semantic + Hybrid Search
   * GET /query/search
   */

  @Get('search')
  async searchProducts(@Query() query: any) {
    try {
      const products = await this.queryService.searchProducts(query);

      // ✅ Safely format data before returning
      const formattedProducts = (products || []).map((p: any) => ({
        ...p,
        price: typeof p.price === 'number' ? p.price : 0,
        in_stock:
          p.in_stock === true ||
          p.in_stock === 'true' ||
          (typeof p.stock === 'number' && p.stock > 0),
      }));

      return { success: true, products: formattedProducts };
    } catch (error) {
      console.error('❌ Error in searchProducts:', error);
      return {
        success: false,
        error: error.message || 'Internal Server Error',
      };
    }
  }

  /**
   * ⚙️ AI SQL Generation Only
   * POST /query/generate-sql
   */
  @Post('generate-sql')
  async generateSQL(@Body('query') naturalLanguageQuery: string) {
    try {
      return await this.queryService.generateSQL(naturalLanguageQuery);
    } catch (error) {
      this.logger.error('❌ Error generating SQL:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * ⚙️ Execute SQL Directly
   * POST /query/execute
   */
  @Post('execute')
  async executeSQL(@Body('sql') sql: string) {
    try {
      const results = await this.queryService.executeQuery(sql);
      return { success: true, results, count: results.length };
    } catch (error) {
      this.logger.error('❌ SQL execution error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🧠 Pure Semantic Search
   * GET /query/semantic-search
   */
  @Get('semantic-search')
  async semanticSearch(
    @Query('q') query: string,
    @Query('similarity') similarity: string,
    @Query('limit') limit: string,
  ) {
    try {
      const threshold = similarity ? parseFloat(similarity) : 0.7;
      const results = await this.queryService.semanticSearch(
        query,
        threshold,
        limit ? parseInt(limit) : 20,
      );
      return {
        success: true,
        query,
        similarityThreshold: threshold,
        results,
        count: results.length,
      };
    } catch (error) {
      this.logger.error('❌ Semantic search error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 💡 Smart Suggestions
   * GET /query/search-suggestions?q=compressor
   */
  @Get('search-suggestions')
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('sessionId') sessionId: string,
  ) {
    try {
      let suggestions: string[] = [];

      if (sessionId) {
        suggestions.push(
          ...(await this.queryService.getPersonalizedSuggestions(sessionId)),
        );
      }

      if (query) {
        suggestions.push(
          ...(await this.queryService.generateQuerySuggestions(query)),
        );
      }

      if (suggestions.length === 0) {
        suggestions.push(...(await this.queryService.getTrendingSearches()));
      }

      return {
        success: true,
        query,
        sessionId,
        suggestions: suggestions.slice(0, 10),
      };
    } catch (error) {
      this.logger.error('❌ Suggestion error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📊 Search Analytics (per session)
   * GET /query/search-analytics?sessionId=123
   */
  @Get('search-analytics')
  async getSearchAnalytics(@Query('sessionId') sessionId: string) {
    try {
      if (!sessionId)
        return { success: false, error: 'Session ID is required' };

      const analytics = await this.queryService.getSearchAnalytics(sessionId);
      return { success: true, sessionId, analytics };
    } catch (error) {
      this.logger.error('❌ Analytics error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🏷️ Brands List
   * GET /query/brands
   */
  @Get('brands')
  async getBrands() {
    try {
      const result = await this.queryService.getBrands();
      return { success: true, brands: result, count: result.length };
    } catch (error) {
      this.logger.error('❌ Brands fetch error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🧩 Categories List
   * GET /query/categories
   */
  @Get('categories')
  async getCategories() {
    try {
      const result = await this.queryService.getCategories();
      return { success: true, categories: result, count: result.length };
    } catch (error) {
      this.logger.error('❌ Categories fetch error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📈 Global Search Stats
   * GET /query/search-stats
   */
  @Get('search-stats')
  async getSearchStats() {
    try {
      const stats = await this.queryService.getSearchStatistics();
      return { success: true, stats };
    } catch (error) {
      this.logger.error('❌ Stats fetch error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🔧 Helper - Create session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
