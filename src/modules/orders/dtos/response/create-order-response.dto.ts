import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from 'src/common/dtos/order.dto';

@ObjectType()
export class createOrderResponseDto {
  @Field(() => Order)
  order: Order;

  @Field()
  client_secret: string;
}
