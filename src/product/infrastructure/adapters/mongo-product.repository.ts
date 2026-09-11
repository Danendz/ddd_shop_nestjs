import { Collection, Db, Filter } from 'mongodb';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.port.js';
import { Product } from '../../domain/entities/product.entity.js';
import { ProductId } from '../../domain/value-objects/product-id.vo.js';
import { Sku } from '../../domain/value-objects/sku.vo.js';
import { Inject } from '@nestjs/common';
import { MONGO_DB } from '../../../shared/infrastructure/database/mongodb/mongo.provider.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { Stock } from '../../domain/value-objects/stock.vo.js';
import { filter } from 'rxjs';

interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  sku: string;
  priceAmount: number;
  priceCurrency: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    const doc = this.toPersistence(product);
    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true },
    );
  }

  async findById(id: ProductId): Promise<Product | null> {
    const row = await this.collection.findOne({ _id: id.getValue() });

    return row ? this.toDomain(row) : null;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const row = await this.collection.findOne({ sku });

    return row ? this.toDomain(row) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const row = await this.collection.findOne({ name });

    return row ? this.toDomain(row) : null;
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const query: Filter<ProductDocument> = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const priceRange: { $gte?: number; $lte?: number } = {};

    if (filters.minPrice !== undefined) {
      priceRange.$gte = Money.toCents(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      priceRange.$lte = Money.toCents(filters.maxPrice);
    }

    if (Object.keys(priceRange).length > 0) {
      query.priceAmount = priceRange;
    }

    const rows = await this.collection.find(query).toArray();

    return rows.map((row) => this.toDomain(row));
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
      description: product.description,
      isActive: product.isActive,
      stock: product.stock.getQuantity(),
      name: product.name,
      sku: product.sku.getValue(),
      priceAmount: Money.toCents(product.price.getAmount()),
      priceCurrency: product.price.getCurrency(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      lowStockThreshold: product.stock.getLowThreshold(),
    };
  }

  private toDomain(row: ProductDocument): Product {
    return Product.reconstitute({
      id: ProductId.from(row._id),
      name: row.name,
      price: Money.create(
        Money.normalizeFromCents(row.priceAmount),
        row.priceCurrency,
      ),
      sku: Sku.create(row.sku),
      stock: Stock.create(row.stock, row.lowStockThreshold),
      isActive: row.isActive,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
