import { ProductDto } from 'src/products/dto/product.dto';
import { UserDto } from 'src/users/dto/user.dto';
import {
  CartRequest,
  CartRequestStatus,
} from '../entities/cart-request.entity';

export class CartRequestDto {
  id: number;

  customer: UserDto;

  status: CartRequestStatus;

  product: ProductDto;

  amount: number;

  constructor(cartRequest: CartRequest) {
    this.id = cartRequest.id;
    this.customer = new UserDto(cartRequest.customer);
    this.status = cartRequest.status;
    this.product = new ProductDto(cartRequest.product);
    this.amount = cartRequest.amount;
  }
}
