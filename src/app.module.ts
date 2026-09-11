import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module.js';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './product/product.module.js';
import { CustomerModule } from './customer/customer.module.js';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    CustomerModule,
    MongoModule,
    DrizzleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
