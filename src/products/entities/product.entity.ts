import { Store } from 'src/stores/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  url!: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => Store, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store!: Store;
}
