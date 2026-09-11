import { Injectable, Inject } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.port.js';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { Product } from '../../domain/entities/product.entity.js';
import { ProductId } from '../../domain/value-objects/product-id.vo.js';
import { products } from '../../../shared/infrastructure/database/postgres/schema/index.js';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { Sku } from '../../domain/value-objects/sku.vo.js';
import { Stock } from '../../domain/value-objects/stock.vo.js';

type ProductRow = typeof products.$inferSelect;

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(product: Product): Promise<void> {
    const row = this.toPersistence(product);

    await this.db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name,
          description: row.description,
          stock: row.stock,
          isActive: row.isActive,
          sku: row.sku,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return this.toDomain(rows[0]);
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = [];

    if (filters.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(
        lte(products.priceAmount, Money.toCents(filters.maxPrice)),
      );
    }

    if (filters.minPrice !== undefined) {
      conditions.push(
        gte(products.priceAmount, Money.toCents(filters.minPrice)),
      );
    }

    const query = this.db.select().from(products);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map((row) => this.toDomain(row));
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.getValue()));

    return rows.length === 0 ? null : this.toDomain(rows[0]);
  }

  async findByName(name: string): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name));

    return rows.length === 0 ? null : this.toDomain(rows[0]);
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id.getValue()));
  }

  private toPersistence(product: Product): ProductRow {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      stock: product.stock.getQuantity(),
      isActive: product.isActive,
      sku: product.sku.getValue(),
      priceAmount: Money.toCents(product.price.getAmount()),
      priceCurrency: product.price.getCurrency(),
      lowStockThreshold: product.stock.getLowThreshold(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private toDomain(row: ProductRow): Product {
    return Product.reconstitute({
      id: ProductId.from(row.id),
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
