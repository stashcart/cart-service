import { Product } from '../entities/product.entity';

export class ProductDto {
  id: number;

  url: string;

  price: number | null;

  name: string | null;

  storeName: string;

  constructor(product: Product) {
    this.id = product.id;
    this.url = product.url;
    this.price = product.price ?? null;
    this.name = product.name ?? null;
    this.storeName = product.store.name;
  }
}
