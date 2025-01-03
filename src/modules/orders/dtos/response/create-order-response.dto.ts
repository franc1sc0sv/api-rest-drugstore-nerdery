import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from 'src/common/models/order.model';

@ObjectType()
export class createOrderResponseDto {
  @Field(() => Order)
  order: Order;

  @Field()
  client_secret: string;
}
