import { Product } from '../entities/product.entity';

export class ProductDto {
  id: number;

  url: string;

  price: number | null;

  name: string;

  storeName: string;

  constructor(product: Product) {
    this.id = product.id;
    this.url = product.url;
    this.price = product.price;
    this.name = product.name;
    this.storeName = product.store.name;
  }
}
