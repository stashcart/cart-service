import { UserDto } from 'src/users/dto/user.dto';
import { Cart } from '../entities/cart.entity';

export class CartPreviewDto {
  id: number;

  title: string;

  owner: UserDto;

  storeName: string;

  isAutoApproveEnabled: boolean;

  constructor(cart: Cart) {
    this.id = cart.id;
    this.title = cart.title;
    this.owner = new UserDto(cart.owner);
    this.storeName = cart.store.name;
    this.isAutoApproveEnabled = cart.isAutoApproveEnabled;
  }
}
