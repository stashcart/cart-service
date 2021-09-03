import { StoreDto } from 'src/stores/dto/store.dto';
import { Product } from '../entities/product.entity';

export class ParsePriceRequestDto {
  id: number;

  url: string;

  store: StoreDto;

  constructor(product: Product) {
    this.id = product.id;
    this.url = product.url;
    this.store = new StoreDto(product.store);
  }
}
