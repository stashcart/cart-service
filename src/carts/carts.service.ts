import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CartItem, CartItemStatus } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService
  ) {}

  // TODO: Add items status
  findOpenedCartsWithItems(): Promise<Cart[]> {
    return this.cartsRepository.find({
      where: { isClosed: false },
      relations: ['items'],
    });
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

  async createCart({
    carterId,
    title,
    storeId,
    isAutoApproveEnabled,
  }: {
    carterId: string;
    title: string;
    storeId: number;
    isAutoApproveEnabled?: boolean;
  }): Promise<Cart> {
    const cart = new Cart();

    cart.title = title;
    cart.isAutoApproveEnabled = isAutoApproveEnabled ?? false;
    cart.carter = await this.usersService.findById(carterId);
    cart.store = await this.storesService.findById(storeId);

    return this.cartsRepository.save(cart);
  }

  // TODO: Add optional ownerId
  async patchCart({
    id,
    title,
    isAutoApproveEnabled,
  }: {
    id: number;
    title?: string;
    isAutoApproveEnabled?: boolean;
  }): Promise<Cart> {
    const cart = await this.findCartByIdWithItems(id);

    if (isDefined(title)) {
      cart.title = title;
    }
    if (isDefined(isAutoApproveEnabled)) {
      cart.isAutoApproveEnabled = isAutoApproveEnabled;
    }

    return this.cartsRepository.save(cart);
  }

  // TODO: Add optional ownerId
  async closeCart(id: number): Promise<void> {
    const cart = await this.findCartById(id);

    cart.isClosed = true;

    await this.cartsRepository.save(cart);
  }

  async addItemToCart({
    cartId,
    customerId,
    productUrl,
    amount,
  }: {
    cartId: number;
    customerId: string;
    productUrl: string;
    amount: number;
  }): Promise<CartItem> {
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
    return cart.carter.id === userId;
  }

  async findAllCartItemsByCartIdAndStatus(
    cartId: number,
    status?: CartItemStatus
  ): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      cart: { id: cartId },
      status,
    });
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

  // TODO: Add optional deleterId
  async deleteItemFromCart(cartId: number, cartItemId: number): Promise<void> {
    const item = await this.findCartItemByIdAndCartId(cartItemId, cartId);

    if (
      this.isCartOwner(item.cart, item.customer.id) ||
      item.status !== CartItemStatus.PENDING
    ) {
      throw new BadRequestException("Can't delete item");
    }

    await this.cartItemsRepository.delete({
      id: cartItemId,
      cart: { id: cartId },
    });
  }

  // TODO: Add optional ownerId
  async approveCartItem(cartId: number, cartItemId: number): Promise<CartItem> {
    const item = await this.findCartItemByIdAndCartId(cartItemId, cartId);
    item.status = CartItemStatus.APPROVED;
    return this.cartItemsRepository.save(item);
  }

  // TODO: Add optional ownerId
  async rejectCartItem(cartId: number, cartItemId: number): Promise<CartItem> {
    const item = await this.findCartItemByIdAndCartId(cartItemId, cartId);
    item.status = CartItemStatus.REJECTED;
    return this.cartItemsRepository.save(item);
  }
}
