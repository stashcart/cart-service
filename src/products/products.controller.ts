import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatchProductRequestDto } from './dto/patch-product.request.dto';
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

  @Patch(':id')
  async patch(
    @Param('id') id: number,
    @Body() patchProductRequestDto: PatchProductRequestDto
  ): Promise<ProductDto> {
    const product = await this.productsService.patchById(
      id,
      patchProductRequestDto
    );
    return new ProductDto(product);
  }
}
