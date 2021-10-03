import { EntityRepository, ObjectLiteral, Repository } from 'typeorm';
import { CartItemStatus } from '../entities/cart-item.entity';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartsRepository extends Repository<Cart> {
  async findByIdWithItemsWithItemsStatus(
    itemsStatus?: CartItemStatus
  ): Promise<Cart | undefined> {
    const itemsJoinCondition: [string | undefined, ObjectLiteral | undefined] =
      itemsStatus
        ? ['items.status = :itemsStatus', { itemsStatus }]
        : [undefined, undefined];

    return this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items', ...itemsJoinCondition)
      .leftJoinAndSelect('items.customer', 'itemCustomer')
      .leftJoinAndSelect('items.product', 'itemsProduct')
      .leftJoinAndSelect('itemsProduct.store', 'itemsProductStore')
      .leftJoinAndSelect('cart.owner', 'owner')
      .leftJoinAndSelect('cart.store', 'store')
      .where('cart.isClosed = false')
      .getOne();
  }
}
