import { Cart } from '../entities/cart.entity';
import { CartItemDto } from './cart-item.dto';
import { CartPreviewDto } from './cart-preview.dto';

export class CartDto extends CartPreviewDto {
  items: CartItemDto[];

  constructor(cart: Cart) {
    super(cart);

    this.items = cart.items.map((item) => new CartItemDto(item));
  }
}
