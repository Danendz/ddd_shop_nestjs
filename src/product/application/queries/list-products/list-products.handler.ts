import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductsQuery } from './list-products.query.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port.js';
import { Inject } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity.js';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<ListProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<Product[]> {
    return this.productRepository.findAll({
      isActive: query.isActive,
      maxPrice: query.maxPrice,
      minPrice: query.minPrice,
    });
  }
}
