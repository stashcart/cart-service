import { IsDefined } from 'class-validator';

export class CreateStoreRequestDto {
  @IsDefined()
  name: string;
}
