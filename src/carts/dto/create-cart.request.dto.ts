import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCartRequestDto {
  @IsUUID()
  ownerId!: string;

  @ApiProperty({ example: 'My cart' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNumber()
  storeId!: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isAutoApproveEnabled?: boolean;
}
