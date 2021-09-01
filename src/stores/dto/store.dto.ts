import { Store } from '../entities/store.entity';

export class StoreDto {
  id: number;

  name: string;

  constructor(store: Store) {
    this.id = store.id;
    this.name = store.name;
  }
}
