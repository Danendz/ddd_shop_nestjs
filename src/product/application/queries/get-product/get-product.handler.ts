import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../ports/product.repository.port.js';
import { ProductId } from '../../../domain/value-objects/product-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(
      ProductId.from(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with id ${query.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return product;
  }
}
