import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port.js';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';
import { ApplicationException } from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(
      CustomerId.from(command.id),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${command.id} wasn't found`,
      );
    }

    await this.customerRepository.delete(CustomerId.from(command.id));
  }
}
