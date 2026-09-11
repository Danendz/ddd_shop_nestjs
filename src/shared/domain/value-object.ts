export interface ValueObject {
  equals(other: this): boolean;
  toString(): string;
}
