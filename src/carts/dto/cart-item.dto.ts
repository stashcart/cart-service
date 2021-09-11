import { ProductDto } from 'src/products/dto/product.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CartItem, CartItemStatus } from '../entities/cart-item.entity';

export class CartItemDto {
  customer: UserDto;

  product: ProductDto;

  amount: number;

  status: CartItemStatus;

  constructor(item: CartItem) {
    this.customer = new UserDto(item.customer);
    this.product = new ProductDto(item.product);
    this.amount = item.amount;
    this.status = item.status;
  }
}
