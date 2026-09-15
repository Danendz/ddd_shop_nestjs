import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from './register-customer.command.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port.js';
import { Email } from '../../../domain/value-objects/email.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<RegisterCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const existingByEmail = await this.customerRepository.findByEmail(
      Email.create(command.email),
    );

    if (existingByEmail) {
      throw new ApplicationException(
        `Customer with email ${command.email} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const customer = this.eventPublisher.mergeObjectContext(
      Customer.register(
        command.email,
        command.firstName,
        command.lastName,
        null,
      ),
    );

    await this.customerRepository.save(customer);

    customer.commit();
  }
}
