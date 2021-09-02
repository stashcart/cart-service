import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
