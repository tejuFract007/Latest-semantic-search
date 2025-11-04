import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataController } from './controllers/data.controller';
import { QueryController } from './controllers/query.controller';
import { DataService } from './services/data.service';
import { QueryService } from './services/query.service';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [DataController, QueryController],
  providers: [DataService, QueryService, DatabaseService],
})
export class AppModule {}
