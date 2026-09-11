import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { ValueObject } from '../../../shared/domain/value-object.js';

export class Email implements ValueObject {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed.length) {
      throw new DomainException('Email cannot be empty');
    }

    if (!Email.EMAIL_PATTERN.test(trimmed)) {
      throw new DomainException(`Invalid email format: ${trimmed}`);
    }

    return new Email(trimmed);
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
