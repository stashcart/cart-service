import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      'product.parse',
      new ParseProductRequestDto(product)
    );

    return product;
  }

  private patch(
    product: Product,
    { price, name }: PatchProductRequestDto
  ): Promise<Product> {
    const patchedProduct = new Product();
    patchedProduct.id = product.id;

    if (price !== undefined) {
      patchedProduct.price = price;
    }
    if (name !== undefined) {
      patchedProduct.name = name;
    }

    return this.productsRepository.save(patchedProduct);
  }

  async patchById(
    cartId: number,
    patchProductDto: PatchProductRequestDto
  ): Promise<Product> {
    const product = await this.findById(cartId);

    return this.patch(product, patchProductDto);
  }

  async patchByUrl(
    url: string,
    patchProductDto: PatchProductRequestDto
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({ url });

    if (!product) {
      throw new NotFoundException(`Product: url=${url}`);
    }

    return this.patch(product, patchProductDto);
  }

  async deleteById(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
