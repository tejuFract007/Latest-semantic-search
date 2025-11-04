import { Controller, Post, Get, Body } from '@nestjs/common';
import { DataService } from '../services/data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('load-all')
  async loadAllData() {
    await this.dataService.loadCategories();
    await this.dataService.loadAttributes();
    const result = await this.dataService.processProducts();
    return { message: 'Data loaded successfully', ...result };
  }

  @Post('load-categories')
  async loadCategories() {
    await this.dataService.loadCategories();
    return { message: 'Categories loaded successfully' };
  }

  @Post('load-attributes')
  async loadAttributes() {
    await this.dataService.loadAttributes();
    return { message: 'Attributes loaded successfully' };
  }
  @Post('process-products')
  async processProducts() {
    return this.dataService.processAllData();
  }

  @Get('stats')
  async getStats() {
    return await this.dataService.getStats();
  }
}
