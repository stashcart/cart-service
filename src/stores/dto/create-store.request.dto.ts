import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateStoreRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;
}
