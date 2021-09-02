import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCartRequestDto {
  @IsDefined()
  carterId: number;

  @ApiProperty({ example: 'My cart' })
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  storeId: number;

  @IsOptional()
  @IsDefined()
  isAutoApproveEnabled?: boolean;
}
