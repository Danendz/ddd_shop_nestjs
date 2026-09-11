import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { QueryHandlers } from './application/queries/index.js';
import { ConfigService } from '@nestjs/config';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...QueryHandlers,
    ...CommandHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoProductRepository,
        drizzleRepo: DrizzleProductRepository,
      ) => {
        return configService.get('DATABASE') === 'mongodb'
          ? mongoRepo
          : drizzleRepo;
      },
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
    },
  ],
})
export class ProductModule {}
