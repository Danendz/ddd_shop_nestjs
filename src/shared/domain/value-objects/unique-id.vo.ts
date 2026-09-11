import { randomUUID } from 'node:crypto';
import { ValueObject } from '../value-object.js';
import { DomainException } from '../exceptions/domain.exception.js';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export abstract class UniqueId implements ValueObject {
  protected abstract readonly __brand: string;

  constructor(private readonly value: string) {
    if (!UUID_PATTERN.test(value)) {
      throw new DomainException(`Invalid id: ${value}`);
    }
  }

  static generate<T extends UniqueId>(this: new (value: string) => T): T {
    return new this(randomUUID());
  }

  static from<T extends UniqueId>(
    this: new (value: string) => T,
    raw: string,
  ): T {
    return new this(raw);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UniqueId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
