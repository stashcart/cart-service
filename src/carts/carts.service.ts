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
import { CartProduct } from './entities/cart-product.entity';
import { CartRequest, CartRequestStatus } from './entities/cart-request.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductsRepository: Repository<CartProduct>,
    @InjectRepository(CartRequest)
    private readonly cartRequestsRepository: Repository<CartRequest>,
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
    const cart = this.cartsRepository.findOne(id);

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

    return this.cartProductsRepository.save(cartProduct);
  }

  private validateProductUrl(productUrl: string, storeUrl: string): boolean {
    return productUrl.includes(storeUrl);
  }

  async deleteProductFromCart(
    cartId: number,
    productId: number
  ): Promise<void> {
    await this.cartProductsRepository.delete({
      cart: { id: cartId },
      product: { id: productId },
    });
  }

  async findAllRequestsByCartIdAndStatus(
    cartId: number,
    status?: CartRequestStatus
  ): Promise<CartRequest[]> {
    return this.cartRequestsRepository.find({
      cart: { id: cartId },
      status,
    });
  }

  async findRequestByIdAndCartId(
    cartId: number,
    requestId: number
  ): Promise<CartRequest> {
    const request = await this.cartRequestsRepository.findOne({
      id: requestId,
      cart: { id: cartId },
    });

    if (!request) {
      throw new NotFoundException(
        `CartRequest: id=${requestId}, cartId=${cartId}`
      );
    }

    return request;
  }

  async createCartRequest({
    cartId,
    customerId,
    productUrl,
    amount,
  }: {
    cartId: number;
    customerId: number;
    productUrl: string;
    amount: number;
  }): Promise<CartRequest> {
    const cart = await this.findCartById(cartId);
    const cartRequest = new CartRequest();
    cartRequest.amount = amount;
    cartRequest.customer = await this.usersService.findById(customerId);
    cartRequest.cart = cart;
    cartRequest.product =
      await this.productsService.findOrCreateByUrlAndStoreId(
        productUrl,
        cart.store.id
      );

    return this.cartRequestsRepository.save(cartRequest);
  }

  async approveCartRequest(
    cartId: number,
    requestId: number
  ): Promise<CartRequest> {
    const request = await this.findRequestByIdAndCartId(cartId, requestId);
    request.status = CartRequestStatus.APPROVED;

    await this.cartRequestsRepository.save(request);

    const cartProduct = new CartProduct();
    cartProduct.amount = request.amount;
    cartProduct.customer = request.customer;
    cartProduct.product = request.product;
    cartProduct.cart = request.cart;

    await this.cartProductsRepository.save(cartProduct);

    return request;
  }

  async rejectCartRequest(
    cartId: number,
    requestId: number
  ): Promise<CartRequest> {
    const request = await this.findRequestByIdAndCartId(cartId, requestId);
    request.status = CartRequestStatus.REJECTED;
    return this.cartRequestsRepository.save(request);
  }

  async deleteCartRequest(cartId: number, requestId: number): Promise<void> {
    const request = await this.findRequestByIdAndCartId(cartId, requestId);
    if (request.status !== CartRequestStatus.PENDING) {
      throw new BadRequestException("Can't delete request");
    }
    await this.cartRequestsRepository.remove(request);
  }
}
