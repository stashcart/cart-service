import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UsersService } from './users.service';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersConsumer {
  constructor(private readonly usersService: UsersService) {}

  @RabbitSubscribe({
    exchange: 'profile',
    routingKey: 'profile.*',
    queue: 'profile.*.cart-service',
  })
  createProfile(profileDto: ProfileDto) {
    this.usersService.putUserFromProfile(profileDto);
  }
}
