import { Injectable } from '@nestjs/common';
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
}
