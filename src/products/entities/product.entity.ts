import { Store } from 'src/stores/entities/store.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  price: number | null;

  @Column({ nullable: true })
  name: string | null;

  @ManyToOne(() => Store, { eager: true })
  store: Store;
}
