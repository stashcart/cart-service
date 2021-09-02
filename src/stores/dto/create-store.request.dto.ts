import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreRequestDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;
}
