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
import { CartProduct, CartProductStatus } from './entities/cart-product.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductsRepository: Repository<CartProduct>,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService
  ) {}

  findOpenedCartsWithProducts(): Promise<Cart[]> {
    return this.cartsRepository.find({
      where: { isClosed: false },
      relations: ['products'],
    });
  }

  async findCartByIdWithProducts(id: number): Promise<Cart> {
    const cart = this.cartsRepository.findOne(id, { relations: ['products'] });

    if (!cart) {
      throw new NotFoundException(`Cart: ${id}`);
    }

    return cart;
  }

  async findCartById(id: number): Promise<Cart> {
    const cart = this.cartsRepository.findOne(id, { relations: ['products'] });

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
    carterId: number;
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
    const cart = await this.findCartByIdWithProducts(id);

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

  async addProductToCart({
    cartId,
    customerId,
    productUrl,
    amount,
  }: {
    cartId: number;
    customerId: number;
    productUrl: string;
    amount: number;
  }): Promise<CartProduct> {
    const cartProduct = new CartProduct();
    const cart = await this.findCartById(cartId);

    if (!this.validateProductUrl(productUrl, cart.store.url)) {
      throw new BadRequestException('Product not related to the store');
    }

    cartProduct.amount = amount;
    cartProduct.cart = cart;
    cartProduct.customer = await this.usersService.findById(customerId);
    cartProduct.product =
      await this.productsService.findOrCreateByUrlAndStoreId(
        productUrl,
        cart.store.id
      );

    if (this.isCartOwner(cart, customerId) || cart.isAutoApproveEnabled) {
      cartProduct.status = CartProductStatus.APPROVED;
    } else {
      cartProduct.status = CartProductStatus.PENDING;
    }

    return this.cartProductsRepository.save(cartProduct);
  }

  private validateProductUrl(productUrl: string, storeUrl: string): boolean {
    return productUrl.includes(storeUrl);
  }

  private isCartOwner(cart: Cart, userId: number): boolean {
    return cart.carter.id === userId;
  }

  async findAllCartProductsByCartIdAndStatus(
    cartId: number,
    status?: CartProductStatus
  ): Promise<CartProduct[]> {
    return this.cartProductsRepository.find({
      cart: { id: cartId },
      status,
    });
  }

  async findCartProductByIdAndCartId(
    cartId: number,
    cartProductId: number
  ): Promise<CartProduct> {
    const request = await this.cartProductsRepository.findOne({
      id: cartProductId,
      cart: { id: cartId },
    });

    if (!request) {
      throw new NotFoundException(
        `CartProduct: id=${cartProductId}, cartId=${cartId}`
      );
    }

    return request;
  }

  // TODO: Add optional deleterId
  async deleteProductFromCart(
    cartId: number,
    cartProductId: number
  ): Promise<void> {
    const cartProduct = await this.findCartProductByIdAndCartId(
      cartId,
      cartProductId
    );

    if (
      this.isCartOwner(cartProduct.cart, cartProduct.customer.id) ||
      cartProduct.status !== CartProductStatus.PENDING
    ) {
      throw new BadRequestException("Can't delete request");
    }

    await this.cartProductsRepository.delete({
      cart: { id: cartId },
      product: { id: cartProductId },
    });
  }

  // TODO: Add optional ownerId
  async approveCartProduct(
    cartId: number,
    cartProductId: number
  ): Promise<CartProduct> {
    const cartProduct = await this.findCartProductByIdAndCartId(
      cartId,
      cartProductId
    );
    cartProduct.status = CartProductStatus.APPROVED;

    return this.cartProductsRepository.save(cartProduct);
  }

  // TODO: Add optional ownerId
  async rejectCartRequest(
    cartId: number,
    cartProductId: number
  ): Promise<CartProduct> {
    const cartProducts = await this.findCartProductByIdAndCartId(
      cartId,
      cartProductId
    );
    cartProducts.status = CartProductStatus.REJECTED;
    return this.cartProductsRepository.save(cartProducts);
  }
}
