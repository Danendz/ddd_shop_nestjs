import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';

export class CustomerId extends UniqueId {
  protected readonly __brand = 'Customer' as const;
}
