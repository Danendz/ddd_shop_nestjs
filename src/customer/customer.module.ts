import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { QueryHandlers } from './application/queries/index.js';
import { CustomersController } from './presentation/customer.controller.js';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port.js';
import { EventHandlers } from './application/events/index.js';
import { NOTIFICATION_RECIPIENT_RESOLVER } from './application/ports/notification-recipient.port.js';
import { CustomerRecipientResolver } from './infrastructure/adapters/customer-recipient.resolver.js';
import { NotificationModule } from '../notification/notification.module.js';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter.js';

@Module({
  imports: [CqrsModule, NotificationModule],
  controllers: [CustomersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: EmailNotificationAdapter,
    },
    {
      provide: NOTIFICATION_RECIPIENT_RESOLVER,
      useClass: CustomerRecipientResolver,
    },
  ],
})
export class CustomerModule {}
