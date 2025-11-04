import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  pool: Pool;

  async onModuleInit() {
    // Get environment variables with fallbacks
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '5433');
    const user = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || 'Teju@#123';
    const database = process.env.DB_NAME || 'fourth_record';

    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
    });

    console.log('✅ Database connection pool initialized');
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
