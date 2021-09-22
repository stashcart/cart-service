import { Product } from '../entities/product.entity';

export class ParseProductRequestDto {
  id: number;

  url: string;

  storeName: string;

  constructor(product: Product) {
    this.id = product.id;
    this.url = product.url;
    this.storeName = product.store.name;
  }
}
