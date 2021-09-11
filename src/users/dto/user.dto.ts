import { User } from '../entities/user.entity';

export class UserDto {
  id: string;

  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
  }
}
