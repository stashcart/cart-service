import { isDefined } from 'class-validator';
import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { CartItemStatus } from '../entities/cart-item.entity';
import { Cart } from '../entities/cart.entity';

@EntityRepository(Cart)
export class CartsRepository extends Repository<Cart> {
  findAllWithItemsByItemsStatus(itemsStatus?: CartItemStatus): Promise<Cart[]> {
    const where: FindConditions<Cart> = { isClosed: false };

    if (isDefined(itemsStatus)) {
      where['items.status'] = itemsStatus;
    }

    // TODO: Whitelist
    return this.find({
      where,
      relations: ['items'],
    });
  }
}
