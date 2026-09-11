import { Product } from '../../domain/entities/product.entity.js';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  sku: string;
  stock: number;
  is_active: boolean;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;

  static fromDomain(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();

    dto.id = product.id.getValue();
    dto.name = product.name;
    dto.description = product.description;
    dto.sku = product.sku.getValue();
    dto.price = product.price.getAmount();
    dto.currency = product.price.getCurrency();
    dto.stock = product.stock.getQuantity();
    dto.is_active = product.isActive;
    dto.low_stock_threshold = product.stock.getLowThreshold();
    dto.created_at = product.createdAt.toISOString();
    dto.updated_at = product.updatedAt.toISOString();

    return dto;
  }
}
