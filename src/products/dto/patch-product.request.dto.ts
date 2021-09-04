import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PatchProductRequestDto {
  @ApiProperty({ example: 'My product' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 19.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
