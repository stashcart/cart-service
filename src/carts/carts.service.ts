import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { whitelist } from 'src/_common/utils/whitelist';
import { Repository } from 'typeorm';
import { AddCartItemRequestDto } from './dto/add-cart-item.request.dto';
import { CreateCartRequestDto } from './dto/create-cart.request.dto';
import { PatchCartRequestDto } from './dto/patch-cart.request.dto';
import { CartItem, CartItemStatus } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartsRepository } from './repositories/carts.repository';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService
  ) {}

  findOpenedCartsWithItems(itemsStatus?: CartItemStatus): Promise<Cart[]> {
    return this.cartsRepository.findAllWithItemsByItemsStatus(itemsStatus);
  }

  async findCartByIdWithItems(id: number): Promise<Cart> {
    const cart = this.cartsRepository.findOne(id, { relations: ['items'] });

    if (!cart) {
      throw new NotFoundException(`Cart: ${id}`);
    }

    return cart;
  }

  async findCartById(id: number): Promise<Cart> {
    const cart = this.cartsRepository.findOne(id);

    if (!cart) {
      throw new NotFoundException(`Cart: ${id}`);
    }

    return cart;
  }

  async createCart(createCartDto: CreateCartRequestDto): Promise<Cart> {
    const cart = new Cart();

    cart.title = createCartDto.title;
    cart.isAutoApproveEnabled = createCartDto.isAutoApproveEnabled ?? false;
    cart.owner = await this.usersService.findById(createCartDto.ownerId);
    cart.store = await this.storesService.findById(createCartDto.storeId);
    cart.items = [];

    return this.cartsRepository.save(cart);
  }

  async patchCart(
    id,
    ownerId: string | undefined,
    { title, isAutoApproveEnabled }: PatchCartRequestDto
  ): Promise<Cart> {
    const cart = await this.findCartByIdWithItems(id);

    if (!this.isCartOwnerOrUndefined(cart, ownerId)) {
      throw new ForbiddenException('Only cart owner can update cart');
    }

    if (isDefined(title)) {
      cart.title = title;
    }
    if (isDefined(isAutoApproveEnabled)) {
      cart.isAutoApproveEnabled = isAutoApproveEnabled;
    }

    return this.cartsRepository.save(cart);
  }

  async closeCart(id: number, ownerId?: string): Promise<void> {
    const cart = await this.findCartById(id);

    if (!this.isCartOwnerOrUndefined(cart, ownerId)) {
      throw new ForbiddenException('Only cart owner can close cart');
    }

    cart.isClosed = true;

    await this.cartsRepository.save(cart);
  }

  async addItemToCart(
    cartId: number,
    { amount, customerId, productUrl }: AddCartItemRequestDto
  ): Promise<CartItem> {
    const cartItem = new CartItem();
    const cart = await this.findCartById(cartId);

    if (!this.validateProductUrl(productUrl, cart.store.url)) {
      throw new BadRequestException('Product not related to the store');
    }

    cartItem.amount = amount;
    cartItem.cart = cart;
    cartItem.customer = await this.usersService.findById(customerId);
    cartItem.product = await this.productsService.findOrCreateByUrlAndStoreId(
      productUrl,
      cart.store.id
    );

    if (this.isCartOwner(cart, customerId) || cart.isAutoApproveEnabled) {
      cartItem.status = CartItemStatus.APPROVED;
    } else {
      cartItem.status = CartItemStatus.PENDING;
    }

    return this.cartItemsRepository.save(cartItem);
  }

  private validateProductUrl(productUrl: string, storeUrl: string): boolean {
    return productUrl.includes(storeUrl);
  }

  private isCartOwner(cart: Cart, userId: string): boolean {
    return cart.owner.id === userId;
  }

  private isCartOwnerOrUndefined(cart: Cart, userId?: string): boolean {
    return userId === undefined || this.isCartOwner(cart, userId);
  }

  async findAllCartItemsByCartIdAndStatus(
    cartId: number,
    status?: CartItemStatus
  ): Promise<CartItem[]> {
    return this.cartItemsRepository.find(
      whitelist({
        cart: { id: cartId },
        status,
      })
    );
  }

  async findCartItemByIdAndCartId(
    cartItemId: number,
    cartId: number
  ): Promise<CartItem> {
    const item = await this.cartItemsRepository.findOne({
      id: cartItemId,
      cart: { id: cartId },
    });

    if (!item) {
      throw new NotFoundException(
        `CartItem: id=${cartItemId}, cartId=${cartId}`
      );
    }

    return item;
  }

  async deleteItemFromCart(
    cartId: number,
    cartItemId: number,
    deleterId?: string
  ): Promise<void> {
    const item = await this.findCartItemByIdAndCartId(cartItemId, cartId);

    if (item.status !== CartItemStatus.PENDING) {
      throw new BadRequestException("Can't delete approved/rejected item");
    }

    if (
      item.customer.id !== deleterId &&
      !this.isCartOwnerOrUndefined(item.cart, deleterId)
    ) {
      throw new ForbiddenException(
        "Can't delete item. User must be an owner of cart ot cart item"
      );
    }

    await this.cartItemsRepository.delete({
      id: cartItemId,
      cart: { id: cartId },
    });
  }

  async setCartItemStatus({
    cartId,
    cartItemId,
    ownerId,
    status,
  }: {
    cartId: number;
    cartItemId: number;
    ownerId?: string;
    status: CartItemStatus;
  }): Promise<CartItem> {
    const item = await this.findCartItemByIdAndCartId(cartItemId, cartId);

    if (!this.isCartOwnerOrUndefined(item.cart, ownerId)) {
      throw new ForbiddenException('Only cart owner can approve/reject item');
    }

    item.status = status;

    return this.cartItemsRepository.save(item);
  }
}
