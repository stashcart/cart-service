import { User } from '../entities/user.entity';

export class UserDto {
  id: number;

  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
  }
}
