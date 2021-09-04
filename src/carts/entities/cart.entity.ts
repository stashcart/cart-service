/* eslint-disable import/no-cycle */
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartProduct } from './cart-product.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'carter_id' })
  carter: User;

  @ManyToOne(() => Store, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => CartProduct, (cp) => cp.product)
  products: CartProduct[];

  @Column({ name: 'is_auto_approve_enabled', default: false })
  isAutoApproveEnabled: boolean;

  @Column({ name: 'is_closed', default: false })
  isClosed: boolean;
}
