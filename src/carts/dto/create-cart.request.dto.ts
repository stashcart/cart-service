import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCartRequestDto {
  @IsDefined()
  carterId: number;

  @ApiProperty({ example: 'My cart' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDefined()
  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsBoolean()
  isAutoApproveEnabled?: boolean;
}
