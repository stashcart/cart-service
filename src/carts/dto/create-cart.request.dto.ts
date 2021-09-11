import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCartRequestDto {
  @IsNumber()
  ownerId: number;

  @ApiProperty({ example: 'My cart' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsBoolean()
  isAutoApproveEnabled?: boolean;
}
