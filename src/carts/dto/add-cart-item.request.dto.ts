import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsUrl, IsUUID, Min } from 'class-validator';

export class AddCartItemRequestDto {
  @IsUUID()
  customerId!: string;

  @ApiProperty({
    example:
      'https://ua.iherb.com/pr/jarrow-formulas-msm-1-000-mg-200-veggie-caps/244',
  })
  @IsUrl()
  @IsDefined()
  productUrl!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  amount!: number;
}
