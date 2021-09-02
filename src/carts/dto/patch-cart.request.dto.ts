import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class PatchCartRequestDto {
  @IsDefined()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsDefined()
  @IsOptional()
  isAutoApproveEnabled?: boolean;
}
