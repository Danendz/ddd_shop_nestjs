import { IEvent } from "@nestjs/cqrs";

export class CustomerRegisteredEvent implements IEvent {
  constructor(
    public readonly customerId: string,
    public readonly email: string,
    public readonly firstName: string,
  ) {}
}
