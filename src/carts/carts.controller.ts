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
import { AddCartItemRequestDto } from './dto/add-cart-item.request.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { CartDto } from './dto/cart.dto';
import { CreateCartRequestDto } from './dto/create-cart.request.dto';
import { PatchCartRequestDto } from './dto/patch-cart.request.dto';

@Controller('carts')
@ApiTags('Carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // TODO: Add items status query
  @Get()
  async findAllCarts(): Promise<CartDto[]> {
    const carts = await this.cartsService.findOpenedCartsWithItems();
    return carts.map((cart) => new CartDto(cart));
  }

  @Get(':id')
  async findCartById(@Param('id') id): Promise<CartDto> {
    const cart = await this.cartsService.findCartByIdWithItems(id);
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

  @Post(':cartId/items')
  async addItem(
    @Param('cartId') cartId: number,
    @Body() addCartItemRequestDto: AddCartItemRequestDto
  ): Promise<CartItemDto> {
    const item = await this.cartsService.addItemToCart(
      cartId,
      addCartItemRequestDto
    );
    return new CartItemDto(item);
  }

  @Delete(':cartId/items/:itemId')
  deleteItemFromCart(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number
  ): Promise<void> {
    return this.cartsService.deleteItemFromCart(cartId, itemId);
  }

  // TODO: findAllPendingItems, approve, reject
}
