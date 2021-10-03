import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ParseProductResponseDto } from './dto/parse-product.response.dto';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsConsumer {
  constructor(private readonly productsService: ProductsService) {}

  @RabbitSubscribe({
    exchange: 'product',
    routingKey: 'product.parsed',
  })
  patchProductWithParseData({ name, price, url }: ParseProductResponseDto) {
    this.productsService.patchByUrl(url, {
      name: name ?? undefined,
      price: price ?? undefined,
    });
  }
}
