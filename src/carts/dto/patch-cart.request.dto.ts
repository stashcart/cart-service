import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchCartRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isAutoApproveEnabled?: boolean;
}
