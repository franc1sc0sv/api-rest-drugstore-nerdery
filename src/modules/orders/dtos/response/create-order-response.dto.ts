import { Order } from 'src/common/dtos/order.dto';

export class createOrderResponseDto {
  order: Order;
  client_secret: string;
}
