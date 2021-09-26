import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateStoreRequestDto {
  @ApiProperty({ example: 'iherb' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'https://ua.iherb.com' })
  @IsUrl()
  url!: string;
}
