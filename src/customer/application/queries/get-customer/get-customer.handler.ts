import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from './get-customer.query.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      CustomerId.from(query.id),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${query.id} wasn't found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
