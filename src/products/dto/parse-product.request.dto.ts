import { Product } from '../entities/product.entity';

export class ParseProductRequestDto {
  url: string;

  storeName: string;

  constructor(product: Product) {
    this.url = product.url;
    this.storeName = product.store.name;
  }
}
