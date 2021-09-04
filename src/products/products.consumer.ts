import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ParseProductResponseDto } from './dto/parsed-product.response.dto';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsConsumer {
  constructor(private readonly productsService: ProductsService) {}

  @RabbitSubscribe({
    exchange: 'product',
    routingKey: 'product.parsed',
    queue: 'cart-service-queue',
  })
  patchProductWithParseData(parsedProductDto: ParseProductResponseDto) {
    this.productsService.patch(parsedProductDto);
  }
}
