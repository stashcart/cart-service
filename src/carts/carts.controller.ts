import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartProductRequestDto } from './dto/add-cart-product.request.dto';
import { CartProductDto } from './dto/cart-product.dto';
import { CartDto } from './dto/cart.dto';
import { CreateCartRequestDto } from './dto/create-cart.request.dto';
import { PatchCartRequestDto } from './dto/patch-cart.request.dto';

@Controller('carts')
@ApiTags('Carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async findAllCarts(): Promise<CartDto[]> {
    const carts = await this.cartsService.findOpenedCarts();
    return carts.map((cart) => new CartDto(cart));
  }

  @Get(':id')
  async findCartById(@Param('id') id): Promise<CartDto> {
    const cart = await this.cartsService.findCartById(id);
    return new CartDto(cart);
  }

  @Post()
  async create(
    @Body() createCartRequestDto: CreateCartRequestDto
  ): Promise<CartDto> {
    const cart = await this.cartsService.createCart(createCartRequestDto);
    return new CartDto(cart);
  }

  @Patch(':id')
  async patchCart(
    @Param('id') id,
    @Body() patchCartRequestDto: PatchCartRequestDto
  ): Promise<CartDto> {
    const cart = await this.cartsService.patchCart({
      ...patchCartRequestDto,
      id,
    });
    return new CartDto(cart);
  }

  @Post(':id/close')
  closeCart(@Param('id') id: number): Promise<void> {
    return this.cartsService.closeCart(id);
  }

  @Post(':cartId/cart-products')
  async addProduct(
    @Param('cartId') cartId: number,
    @Body() addCartProductRequestDto: AddCartProductRequestDto
  ): Promise<CartProductDto> {
    const cartProduct = await this.cartsService.addProductToCart({
      ...addCartProductRequestDto,
      cartId,
    });
    return new CartProductDto(cartProduct);
  }

  @Delete(':cartId/cart-products/:productId')
  deleteProductFromCart(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number
  ): Promise<void> {
    return this.cartsService.deleteProductFromCart(cartId, productId);
  }
}
