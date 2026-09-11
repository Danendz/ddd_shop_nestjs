import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command.js';
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

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.productRepository.findById(
      ProductId.from(command.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with id ${command.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.productRepository.deleteById(ProductId.from(command.id));
  }
}
