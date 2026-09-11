import { AggregateRoot } from '../../../shared/domain/aggregate-root.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { ProductId } from '../value-objects/product-id.vo.js';
import { Sku } from '../value-objects/sku.vo.js';
import { Stock } from '../value-objects/stock.vo.js';

export interface ProductProps {
  id: ProductId;
  name: string;
  description: string;
  price: Money;
  sku: Sku;
  stock: Stock;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private readonly _id: ProductId;
  private _name: string;
  private _description: string;
  private _price: Money;
  private _sku: Sku;
  private _stock: Stock;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ProductProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._sku = props.sku;
    this._stock = props.stock;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    name: string,
    description: string,
    sku: string,
    price: number,
    currency: string,
    stock: number,
  ) {
    Product.validateName(name);

    const now = new Date();

    return new Product({
      id: ProductId.generate(),
      name,
      description,
      sku: Sku.create(sku),
      price: Money.create(price, currency),
      stock: Stock.create(stock, 5),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  private static validateName(name: string): void {
    if (name.length < 2) {
      throw new DomainException('Product name must be at least 2 characters');
    }
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): Money {
    return this._price;
  }

  get sku(): Sku {
    return this._sku;
  }

  get stock(): Stock {
    return this._stock;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
