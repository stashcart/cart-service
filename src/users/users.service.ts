import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  putUserFromProfile(profileDto: ProfileDto) {
    const user = new User();
    user.id = profileDto.id;
    user.name = profileDto.name;

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User: ${id}`);
    }

    return user;
  }

  create({ name }: { name: string }) {
    const user = new User();
    user.name = name;

    return this.usersRepository.save(user);
  }
}
