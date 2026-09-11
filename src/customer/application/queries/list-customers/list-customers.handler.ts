import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from './list-customers.query.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../../ports/customer.repository.port.js';
import { Customer } from '../../../domain/entities/customer.entity.js';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<ListCustomersQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: ListCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
