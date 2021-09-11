import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserDto(user));
  }

  @Get(':id')
  async findById(@Param() id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    return new UserDto(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserDto(user);
  }
}
