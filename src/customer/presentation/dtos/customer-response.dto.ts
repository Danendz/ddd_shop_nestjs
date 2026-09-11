import { Customer } from '../../domain/entities/customer.entity.js';

export class CustomerResponseDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  phone: string | null;
  created_at: string;
  updated_at: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    dto.id = customer.id.getValue();
    dto.email = customer.email.getValue();
    dto.first_name = customer.firstName;
    dto.last_name = customer.lastName;
    dto.full_name = customer.getFullName();
    dto.phone = customer.phone?.getValue() ?? null;
    dto.created_at = customer.createdAt.toISOString();
    dto.updated_at = customer.updatedAt.toISOString();

    return dto;
  }
}
