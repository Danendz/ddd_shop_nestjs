import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { ValueObject } from '../../../shared/domain/value-object.js';

export class Phone implements ValueObject {
  private static readonly MIN_LENGTH = 7;
  private static readonly MAX_LENGTH = 15;

  constructor(private readonly value: string) {}

  static create(phone: string): Phone {
    const trimmed = phone.trim().toLowerCase().replace(/\D/g, '');

    if (!trimmed.length) {
      throw new DomainException('Phone cannot be empty');
    }

    if (trimmed.length < this.MIN_LENGTH || trimmed.length > this.MAX_LENGTH) {
      throw new DomainException(
        `Phone number must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters`,
      );
    }

    return new Phone(trimmed);
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
