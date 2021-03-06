import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreRequestDto } from './dto/create-store.request.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>
  ) {}

  async create({ name, url }: CreateStoreRequestDto): Promise<Store> {
    const store = new Store();
    store.name = name;
    store.url = url;

    return this.storesRepository.save(store);
  }

  findAll(): Promise<Store[]> {
    return this.storesRepository.find();
  }

  async findById(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne(id);

    if (!store) {
      throw new NotFoundException(`Store: ${id}`);
    }

    return store;
  }

  async deleteById(id: number): Promise<void> {
    await this.storesRepository.delete(id);
  }
}
