import { ProductDto } from 'src/products/dto/product.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CartProduct } from '../entities/cart-product.entity';

export class CartProductDto {
  customer: UserDto;

  product: ProductDto;

  amount: number;

  constructor(cartProduct: CartProduct) {
    this.customer = new UserDto(cartProduct.customer);
    this.product = new ProductDto(cartProduct.product);
    this.amount = cartProduct.amount;
  }
}