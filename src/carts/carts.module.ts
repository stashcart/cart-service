import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartProduct])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
