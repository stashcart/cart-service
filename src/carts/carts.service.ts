import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CartProduct } from './entities/cart-product.entity';
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

  findOpenedCarts(): Promise<Cart[]> {
    return this.cartsRepository.find({ where: { isClosed: false } });
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
    const cart = await this.findCartById(id);

    cart.title = title;
    cart.isAutoApproveEnabled = isAutoApproveEnabled;

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

    cartProduct.amount = amount;
    cartProduct.cart = await this.findCartById(cartId);
    cartProduct.customer = await this.usersService.findById(customerId);
    cartProduct.product =
      await this.productsService.findOrCreateByUrlAndStoreId(productUrl);

    return this.cartProductsRepository.save(cartProduct);
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
}
