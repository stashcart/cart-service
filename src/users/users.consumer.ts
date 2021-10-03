import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UsersService } from './users.service';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersConsumer {
  constructor(private readonly usersService: UsersService) {}

  @RabbitSubscribe({
    exchange: 'user.write',
    routingKey: 'user.*',
  })
  createProfile(profileDto: ProfileDto) {
    this.usersService.putUserFromProfile(profileDto);
  }
}
