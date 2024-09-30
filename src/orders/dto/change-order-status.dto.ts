import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
