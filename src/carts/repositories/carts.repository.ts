import { isDefined } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { CartItemStatus } from '../entities/cart-item.entity';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartsRepository extends Repository<Cart> {
  findAllWithItemsByItemsStatus(itemsStatus?: CartItemStatus): Promise<Cart[]> {
    const qb = this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoinAndSelect('items.customer', 'itemCustomer')
      .leftJoinAndSelect('items.product', 'itemsProduct')
      .leftJoinAndSelect('itemsProduct.store', 'itemsProductStore')
      .leftJoinAndSelect('cart.owner', 'owner')
      .leftJoinAndSelect('cart.store', 'store')
      .where('cart.isClosed = false');

    if (isDefined(itemsStatus)) {
      qb.andWhere('items.status = :itemsStatus', { itemsStatus });
    }

    return qb.getMany();
  }
}
