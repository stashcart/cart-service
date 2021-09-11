import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StoresModule } from 'src/stores/stores.module';
import { ProductsService } from 'src/products/products.service';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartRequest } from './entities/cart-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, CartRequest]),
    UsersModule,
    StoresModule,
    ProductsService,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
