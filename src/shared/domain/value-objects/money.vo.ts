import { DomainException } from '../exceptions/domain.exception.js';
import { ValueObject } from '../value-object.js';

export class Money implements ValueObject {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  equals(other: this): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }

  static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new DomainException('Money amount cannot be negative');
    }

    const normalized = Math.round(amount * 100) / 100;
    return new Money(normalized, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  static toCents(amount: number) {
    return Math.round(amount * 100);
  }

  static normalizeFromCents(cents: number) {
    return cents / 100;
  }
}
