import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../application/ports/customer.repository.port.js';
import { Customer } from '../../domain/entities/customer.entity.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { customers } from '../../../shared/infrastructure/database/postgres/schema/customer.schema.js';
import { Phone } from '../../domain/value-objects/phone.vo.js';
import { eq } from 'drizzle-orm';

type CustomerRow = typeof customers.$inferSelect;

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(customer: Customer): Promise<void> {
    const row = this.toPersistence(customer);

    await this.db
      .insert(customers)
      .values(row)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: row.email,
          createdAt: row.createdAt,
          firstName: row.firstName,
          lastName: row.lastName,
          isActive: row.isActive,
          phone: row.phone,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id.getValue()));

    if (rows.length === 0) {
      return null;
    }

    return this.toDomain(rows[0]);
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (rows.length === 0) {
      return null;
    }

    return this.toDomain(rows[0]);
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);

    return rows.map((row) => this.toDomain(row));
  }

  async delete(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }

  private toPersistence(customer: Customer): CustomerRow {
    return {
      id: customer.id.getValue(),
      email: customer.email.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      isActive: customer.isActive,
      phone: customer.phone ? customer.phone.getValue() : null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private toDomain(row: CustomerRow): Customer {
    return Customer.reconstitute({
      id: CustomerId.from(row.id),
      email: Email.create(row.email),
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone ? Phone.create(row.phone) : null,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
