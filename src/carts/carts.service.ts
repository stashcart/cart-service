/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartProduct } from './entities/cart-product.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: Repository<Cart>,
    private readonly cartProductsRepository: Repository<CartProduct>
  ) {}

  findAllCarts(): Promise<Cart[]> {
    throw new Error('Method not implemented.');
  }

  // TODO: Remove eslint rule on the top of file
  findCartById(id: number): Promise<Cart> {
    throw new Error('Method not implemented.');
  }

  createCart({
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
    throw new Error('Method not implemented.');
  }

  patchCart({
    id,
    title,
    isAutoApproveEnabled,
  }: {
    id: number;
    title?: string;
    isAutoApproveEnabled?: boolean;
  }): Promise<Cart> {
    throw new Error('Method not implemented.');
  }

  closeCart(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addProductToCart({
    id,
    customerId,
    productUrl,
    amount,
  }: {
    id: number;
    customerId: number;
    productUrl: string;
    amount: number;
  }): Promise<CartProduct> {
    throw new Error('Method not implemented.');
  }

  deleteProductFromCart(cartId: number, productId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
