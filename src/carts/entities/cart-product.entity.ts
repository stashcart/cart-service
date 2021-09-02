/* eslint-disable import/no-cycle */
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_products')
export class CartProduct {
  @ManyToOne(() => Cart, { primary: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column()
  amount: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
