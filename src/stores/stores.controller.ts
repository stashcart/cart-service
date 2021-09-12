import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStoreRequestDto } from './dto/create-store.request.dto';
import { StoreDto } from './dto/store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
@ApiTags('Store')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(): Promise<StoreDto[]> {
    const stores = await this.storesService.findAll();
    return stores.map((store) => new StoreDto(store));
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<StoreDto> {
    const store = await this.storesService.findById(id);
    return new StoreDto(store);
  }

  @Post()
  async create(
    @Body() createStoreRequestDto: CreateStoreRequestDto
  ): Promise<StoreDto> {
    const store = await this.storesService.create(createStoreRequestDto);
    return new StoreDto(store);
  }

  @Delete(':id')
  deleteById(@Param('id') id: number): Promise<void> {
    return this.storesService.deleteById(id);
  }
}
