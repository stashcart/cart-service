import { IsOptional, IsUUID } from 'class-validator';

export class FindAllCartsQueryDto {
  @IsUUID()
  @IsOptional()
  ownerId?: string;
}
