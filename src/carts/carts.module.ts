import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StoresModule } from 'src/stores/stores.module';
import { ProductsModule } from 'src/products/products.module';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartItem } from './entities/cart-item.entity';
import { CartsRepository } from './repositories/carts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartsRepository, CartItem]),
    UsersModule,
    StoresModule,
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
