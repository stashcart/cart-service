import { UserDto } from 'src/users/dto/user.dto';
import { Cart } from '../entities/cart.entity';
import { CartProductDto } from './cart-product.dto';

export class CartDto {
  id: number;

  title: string;

  carter: UserDto;

  storeName: string;

  isAutoApproveEnabled: boolean;

  products: CartProductDto[];

  constructor(cart: Cart) {
    this.id = cart.id;
    this.title = cart.title;
    this.carter = new UserDto(cart.carter);
    this.storeName = cart.store.name;
    this.isAutoApproveEnabled = cart.isAutoApproveEnabled;
    this.products = cart.products.map((product) => new CartProductDto(product));
  }
}
