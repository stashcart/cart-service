import { IsEnum, IsOptional } from 'class-validator';
import { CartRequestStatus } from '../entities/cart-request.entity';

export class CartRequestQueryDto {
  @IsEnum(CartRequestStatus)
  @IsOptional()
  status?: CartRequestStatus;
}
