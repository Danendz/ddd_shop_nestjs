import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';

export class ProductId extends UniqueId {
  protected readonly __brand = 'Product' as const;
}
