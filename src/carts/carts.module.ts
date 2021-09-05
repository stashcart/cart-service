import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StoresModule } from 'src/stores/stores.module';
import { ProductsService } from 'src/products/products.service';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';
import { CartRequest } from './entities/cart-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct, CartRequest]),
    UsersModule,
    StoresModule,
    ProductsService,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
