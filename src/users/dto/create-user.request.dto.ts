import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'John Wick' })
  @IsString()
  name!: string;
}
