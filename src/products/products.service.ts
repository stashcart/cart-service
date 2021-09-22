import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { AmqpService } from 'src/amqp/amqp.service';
import { StoresService } from 'src/stores/stores.service';
import { Repository } from 'typeorm';
import { ParseProductRequestDto } from './dto/parse-product.request.dto';
import { PatchProductRequestDto } from './dto/patch-product.request.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly storeService: StoresService,
    private readonly amqpService: AmqpService
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product: ${id}`);
    }

    return product;
  }

  findByUrl(url: string): Promise<Product | undefined> {
    return this.productsRepository.findOne({ url });
  }

  async createFromUrlAndStoreId(
    url: string,
    storeId: number
  ): Promise<Product> {
    const product = new Product();
    product.url = url;
    product.store = await this.storeService.findById(storeId);

    return this.productsRepository.save(product);
  }

  async findOrCreateByUrlAndStoreId(
    url: string,
    storeId: number
  ): Promise<Product> {
    const product =
      (await this.findByUrl(url)) ??
      (await this.createFromUrlAndStoreId(url, storeId));

    await this.amqpService.publish(
      'product',
      'parse',
      new ParseProductRequestDto(product)
    );

    return product;
  }

  async patch(
    cartId: number,
    { price, name }: PatchProductRequestDto
  ): Promise<Product> {
    const product = await this.findById(cartId);

    if (isDefined(product.price)) {
      product.price = price;
    }
    if (isDefined(product.name)) {
      product.name = name;
    }

    return this.productsRepository.save(product);
  }
}
