import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmqpService } from 'src/amqp/amqp.service';
import { StoresService } from 'src/stores/stores.service';
import { Repository } from 'typeorm';
import { ParsePriceRequestDto } from './dto/parse-price.request.dto';
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

    const savedProduct = await this.productsRepository.save(product);

    await this.amqpService.publish(
      'product',
      'parse',
      new ParsePriceRequestDto(savedProduct)
    );

    return savedProduct;
  }

  async findOrCreateByUrlAndStoreId(
    url: string,
    storeId: number
  ): Promise<Product> {
    const product = await this.findByUrl(url);

    return product ?? this.createFromUrlAndStoreId(url, storeId);
  }
}
