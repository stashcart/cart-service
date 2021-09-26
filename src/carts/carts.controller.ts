import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OnBehalfOf } from 'src/_common/decorators/on-behalf-of.decorator';
import { ApiOnBehalfOf } from 'src/_common/decorators/swagger/api.on-behalf-of.decorator';
import { CartsService } from './carts.service';
import { AddCartItemRequestDto } from './dto/add-cart-item.request.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { CartDto } from './dto/cart.dto';
import { CreateCartRequestDto } from './dto/create-cart.request.dto';
import { FindAllCartsQueryDto } from './dto/find-all-carts.query.dto';
import { PatchCartRequestDto } from './dto/patch-cart.request.dto';
import { CartItemStatus } from './entities/cart-item.entity';

@Controller('carts')
@ApiTags('Carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async findAllCarts(@Query() query: FindAllCartsQueryDto): Promise<CartDto[]> {
    const carts = await this.cartsService.findOpenedCartsWithItems(
      query.itemsStatus
    );
    return carts.map((cart) => new CartDto(cart));
  }

  @Get(':id')
  async findCartById(@Param('id') id: number): Promise<CartDto> {
    const cart = await this.cartsService.findCartByIdWithItems(id);
    return new CartDto(cart);
  }

  @ApiOnBehalfOf()
  @Post()
  async create(
    @Body() { ownerId, ...createCartRequestDto }: CreateCartRequestDto,
    @OnBehalfOf() userId?: string
  ): Promise<CartDto> {
    const cart = await this.cartsService.createCart({
      ...createCartRequestDto,
      ownerId: userId ?? ownerId,
    });
    return new CartDto(cart);
  }

  @ApiOnBehalfOf()
  @Patch(':id')
  async patchCart(
    @Param('id') id: number,
    @Body() patchCartRequestDto: PatchCartRequestDto,
    @OnBehalfOf() userId?: string
  ): Promise<CartDto> {
    const cart = await this.cartsService.patchCart(
      id,
      patchCartRequestDto,
      userId
    );
    return new CartDto(cart);
  }

  @ApiOnBehalfOf()
  @Post(':id/close')
  closeCart(
    @Param('id') id: number,
    @OnBehalfOf() userId?: string
  ): Promise<void> {
    return this.cartsService.closeCart(id, userId);
  }

  @ApiOnBehalfOf()
  @Post(':cartId/items')
  async addItem(
    @Param('cartId') cartId: number,
    @Body() { customerId, ...addCartItemRequestDto }: AddCartItemRequestDto,
    @OnBehalfOf() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.addItemToCart(cartId, {
      ...addCartItemRequestDto,
      customerId: userId ?? customerId,
    });
    return new CartItemDto(item);
  }

  @ApiOnBehalfOf()
  @Delete(':cartId/items/:itemId')
  deleteItemFromCart(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @OnBehalfOf() userId?: string
  ): Promise<void> {
    return this.cartsService.deleteItemFromCart(cartId, itemId, userId);
  }

  @Get(':cartId/items')
  async findAllCartItems(
    @Param('cartId') cartId: number,
    @Query() query: FindAllCartsQueryDto
  ): Promise<CartItemDto[]> {
    const items = await this.cartsService.findAllCartItemsByCartIdAndStatus(
      cartId,
      query.itemsStatus
    );
    return items.map((item) => new CartItemDto(item));
  }

  @ApiOnBehalfOf()
  @Post(':cartId/items/:itemId/approve')
  async approveCartItem(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @OnBehalfOf() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.setCartItemStatus({
      cartId,
      cartItemId: itemId,
      ownerId: userId,
      status: CartItemStatus.APPROVED,
    });
    return new CartItemDto(item);
  }

  @ApiOnBehalfOf()
  @Post(':cartId/items/:itemId/reject')
  async rejectCartItem(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @OnBehalfOf() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.setCartItemStatus({
      cartId,
      cartItemId: itemId,
      ownerId: userId,
      status: CartItemStatus.REJECTED,
    });
    return new CartItemDto(item);
  }
}
