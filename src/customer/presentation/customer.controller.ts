import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCustomerDto } from './dtos/register-customer.dto.js';
import { RegisterCustomerCommand } from '../application/use-cases/register-customer/register-customer.command.js';
import { CustomerResponseDto } from './dtos/customer-response.dto.js';
import { GetCustomerQuery } from '../application/queries/get-customer/get-customer.query.js';
import { ListCustomersQuery } from '../application/queries/list-customers/list-customers.query.js';
import { Customer } from '../domain/entities/customer.entity.js';
import { DeleteCustomerCommand } from '../application/use-cases/delete-customer/delete-customer.command.js';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async register(@Body() dto: RegisterCustomerDto) {
    await this.commandBus.execute(
      new RegisterCustomerCommand(dto.email, dto.first_name, dto.last_name),
    );
  }

  @Get(':id')
  async findById(
    @Param(':id', ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );

    return CustomerResponseDto.fromDomain(customer);
  }

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      ListCustomersQuery,
      Customer[]
    >(new ListCustomersQuery());

    return customers.map((customer) =>
      CustomerResponseDto.fromDomain(customer),
    );
  }

  @Delete(':id')
  async delete(@Param(':id', ParseUUIDPipe) id: string) {
    await this.commandBus.execute(new DeleteCustomerCommand(id));
  }
}
