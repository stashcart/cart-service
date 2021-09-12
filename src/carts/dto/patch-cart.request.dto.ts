import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchCartRequestDto {
  @ApiProperty({ example: 'My renamed cart' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isAutoApproveEnabled?: boolean;
}
