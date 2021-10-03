import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from 'src/stores/stores.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductsConsumer } from './products.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StoresModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsConsumer],
  exports: [ProductsService],
})
export class ProductsModule {}
