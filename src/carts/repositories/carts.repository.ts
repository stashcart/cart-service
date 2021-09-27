import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { CartItemStatus } from '../entities/cart-item.entity';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartsRepository extends Repository<Cart> {
  findAllWithItemsByItemsStatus(itemsStatus?: CartItemStatus): Promise<Cart[]> {
    return this.find({
      where: (qb: SelectQueryBuilder<Cart>) => {
        qb.where({ isClosed: false });

        if (itemsStatus !== undefined) {
          qb.andWhere('Cart__items.status = :itemsStatus', { itemsStatus });
        }
      },
      relations: ['items'],
    });
  }
}
