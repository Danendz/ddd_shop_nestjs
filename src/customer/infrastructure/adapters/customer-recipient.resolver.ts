import { Inject, Injectable } from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception.js';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../application/ports/customer.repository.port.js';
import {
  NotificationRecipientResolver,
  RecipientContact,
} from '../../application/ports/notification-recipient.port.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';

@Injectable()
export class CustomerRecipientResolver implements NotificationRecipientResolver {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customers: CustomerRepository,
  ) {}

  async resolve(recipientId: string): Promise<RecipientContact> {
    const customer = await this.customers.findById(
      CustomerId.from(recipientId),
    );

    if (!customer) {
      throw new ApplicationException(
        `Notification recipient ${recipientId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return {
      email: customer.email.getValue(),
      phone: customer.phone?.getValue() ?? null,
    };
  }
}
