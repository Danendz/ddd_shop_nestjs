import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { ValueObject } from '../../../shared/domain/value-object.js';

export class Stock implements ValueObject {
  private constructor(
    private readonly quantity: number,
    private readonly lowThreshold: number,
  ) {}

  equals(other: this): boolean {
    return (
      this.quantity === other.quantity &&
      this.lowThreshold === other.lowThreshold
    );
  }

  toString(): string {
    return `${this.quantity}`;
  }

  static create(quantity: number, lowThreshold: number): Stock {
    if (quantity < 0) {
      throw new DomainException(`Quantity ${quantity} must not be less than 0`);
    }

    if (lowThreshold < 0) {
      throw new DomainException(
        `Low threshold ${lowThreshold} must not be less than 0`,
      );
    }

    return new Stock(quantity, lowThreshold);
  }

  isLow(): boolean {
    return this.quantity <= this.lowThreshold;
  }

  decrease(by: number): Stock {
    this.validateDelta(by);

    if (this.quantity - by < 0) {
      throw new DomainException(
        `Cannot decrease stock by ${by}: only ${this.quantity} available`,
      );
    }

    return new Stock(this.quantity - by, this.lowThreshold);
  }

  increase(by: number): Stock {
    this.validateDelta(by);
    return new Stock(this.quantity + by, this.lowThreshold);
  }

  withThreshold(n: number): Stock {
    return new Stock(this.quantity, n);
  }

  private validateDelta(by: number): void {
    if (!Number.isInteger(by) || by <= 0) {
      throw new DomainException('Stock delta must be a positive integer');
    }
  }

  getQuantity() {
    return this.quantity;
  }

  getLowThreshold() {
    return this.lowThreshold;
  }
}
