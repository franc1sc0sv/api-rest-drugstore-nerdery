import { Field, ObjectType } from '@nestjs/graphql';
import { OrderModel } from 'src/common/models/order.model';

@ObjectType()
export class createOrderResponse {
  @Field(() => OrderModel)
  order: OrderModel;

  @Field()
  client_secret: string;
}
