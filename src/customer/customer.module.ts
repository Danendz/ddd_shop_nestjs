import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { QueryHandlers } from './application/queries/index.js';
import { CustomersController } from './presentation/customer.controller.js';

@Module({
  imports: [CqrsModule],
  controllers: [CustomersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
