import { UserDto } from 'src/users/dto/user.dto';
import { Cart } from '../entities/cart.entity';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  id: number;

  title: string;

  owner: UserDto;

  storeName: string;

  isAutoApproveEnabled: boolean;

  items: CartItemDto[];

  constructor(cart: Cart) {
    this.id = cart.id;
    this.title = cart.title;
    this.owner = new UserDto(cart.owner);
    this.storeName = cart.store.name;
    this.isAutoApproveEnabled = cart.isAutoApproveEnabled;
    this.items = cart.items.map((item) => new CartItemDto(item));
  }
}
