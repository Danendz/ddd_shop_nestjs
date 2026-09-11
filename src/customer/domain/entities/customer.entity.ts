import { AggregateRoot } from '../../../shared/domain/aggregate-root.js';
import { CustomerId } from '../value-objects/customer-id.vo.js';
import { Email } from '../value-objects/email.vo.js';
import { Phone } from '../value-objects/phone.vo.js';

interface CustomerProps {
  id: CustomerId;
  email: Email;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phone: Phone | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private readonly _id: CustomerId;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _isActive: boolean;
  private _phone: Phone | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();

    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._isActive = props.isActive;
    this._phone = props.phone;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static register(
    email: string,
    firstName: string,
    lastName: string,
    phone: string | null,
  ): Customer {
    const id = CustomerId.generate();
    const now = new Date();

    return new Customer({
      id,
      email: Email.create(email),
      firstName,
      lastName,
      phone: phone ? Phone.create(phone) : null,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get isActive() {
    return this._isActive;
  }

  get phone() {
    return this._phone;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
