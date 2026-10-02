import { IsEnum } from 'class-validator';
import { OrderStatusDto } from './order-query.dto';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusDto)
  status!: OrderStatusDto;
}
