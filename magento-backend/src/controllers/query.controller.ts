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
