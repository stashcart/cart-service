import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<ProductDto[]> {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductDto(product));
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ProductDto> {
    const product = await this.productsService.findById(id);
    return new ProductDto(product);
  }
}
