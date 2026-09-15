import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../ports/notification.port.js';
import { CustomerRegisteredEvent } from '../../domain/events/customer-registered.event.js';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome',
      message: `Welcome to ddd shop: ${event.firstName}! Your account has been created.`,
    });
  }
}
