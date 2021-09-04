import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('table')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  url: string;
}
