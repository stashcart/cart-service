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
import { UserId } from 'src/_common/decorators/user-id.decorator';
import { ApiUserId } from 'src/_common/decorators/swagger/api.user-id.decorator';
import { CartsService } from './carts.service';
import { AddCartItemRequestDto } from './dto/add-cart-item.request.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { CartPreviewDto } from './dto/cart-preview.dto';
import { CartDto } from './dto/cart.dto';
import { CreateCartRequestDto } from './dto/create-cart.request.dto';
import { FindAllCartsQueryDto } from './dto/find-all-carts.query.dto';
import { CartItemsQueryDto } from './dto/cart-items.query.dto';
import { PatchCartRequestDto } from './dto/patch-cart.request.dto';
import { CartItemStatus } from './entities/cart-item.entity';

@Controller('carts')
@ApiTags('Carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async findAllCarts(
    @Query() query: FindAllCartsQueryDto
  ): Promise<CartPreviewDto[]> {
    const carts = await this.cartsService.findOpenedCartsByOwnerId(
      query.ownerId
    );
    return carts.map((cart) => new CartPreviewDto(cart));
  }

  @Get(':id')
  async findCartById(
    @Param('id') id: number,
    @Query() query: CartItemsQueryDto
  ): Promise<CartDto> {
    const cart = await this.cartsService.findCartByIdWithItems(
      id,
      query.itemsStatus
    );
    return new CartDto(cart);
  }

  @ApiUserId()
  @Post()
  async create(
    @Body() { ownerId, ...createCartRequestDto }: CreateCartRequestDto,
    @UserId() userId?: string
  ): Promise<CartDto> {
    const cart = await this.cartsService.createCart({
      ...createCartRequestDto,
      ownerId: userId ?? ownerId,
    });
    return new CartDto(cart);
  }

  @ApiUserId()
  @Patch(':id')
  async patchCart(
    @Param('id') id: number,
    @Body() patchCartRequestDto: PatchCartRequestDto,
    @UserId() userId?: string
  ): Promise<CartDto> {
    const cart = await this.cartsService.patchCart(
      id,
      patchCartRequestDto,
      userId
    );
    return new CartDto(cart);
  }

  @ApiUserId()
  @Post(':id/close')
  closeCart(@Param('id') id: number, @UserId() userId?: string): Promise<void> {
    return this.cartsService.closeCart(id, userId);
  }

  @ApiUserId()
  @Post(':cartId/items')
  async addItem(
    @Param('cartId') cartId: number,
    @Body() { customerId, ...addCartItemRequestDto }: AddCartItemRequestDto,
    @UserId() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.addItemToCart(cartId, {
      ...addCartItemRequestDto,
      customerId: userId ?? customerId,
    });
    return new CartItemDto(item);
  }

  @ApiUserId()
  @Delete(':cartId/items/:itemId')
  deleteItemFromCart(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @UserId() userId?: string
  ): Promise<void> {
    return this.cartsService.deleteItemFromCart(cartId, itemId, userId);
  }

  @Get(':cartId/items')
  async findAllCartItems(
    @Param('cartId') cartId: number,
    @Query() query: CartItemsQueryDto
  ): Promise<CartItemDto[]> {
    const items = await this.cartsService.findAllCartItemsByCartIdAndStatus(
      cartId,
      query.itemsStatus
    );
    return items.map((item) => new CartItemDto(item));
  }

  @ApiUserId()
  @Post(':cartId/items/:itemId/approve')
  async approveCartItem(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @UserId() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.setCartItemStatus({
      cartId,
      itemId,
      itemOwnerId: userId,
      status: CartItemStatus.APPROVED,
    });
    return new CartItemDto(item);
  }

  @ApiUserId()
  @Post(':cartId/items/:itemId/reject')
  async rejectCartItem(
    @Param('cartId') cartId: number,
    @Param('itemId') itemId: number,
    @UserId() userId?: string
  ): Promise<CartItemDto> {
    const item = await this.cartsService.setCartItemStatus({
      cartId,
      itemId,
      itemOwnerId: userId,
      status: CartItemStatus.REJECTED,
    });
    return new CartItemDto(item);
  }
}
