import { IsEnum, IsOptional } from 'class-validator';
import { CartItemStatus } from '../entities/cart-item.entity';

export class FindAllCartsQueryDto {
  @IsEnum(CartItemStatus)
  @IsOptional()
  itemsStatus?: CartItemStatus;
}
