import { IsEnum, IsOptional } from 'class-validator';
import { CartItemStatus } from '../entities/cart-item.entity';

export class FindAddCartItemsQueryDto {
  @IsEnum(CartItemStatus)
  @IsOptional()
  status?: CartItemStatus;
}
