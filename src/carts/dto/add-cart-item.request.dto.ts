import { IsDefined, IsNumber, IsUrl, Min } from 'class-validator';

export class AddCartItemRequestDto {
  @IsDefined()
  @IsNumber()
  customerId: string;

  @IsUrl()
  @IsDefined()
  productUrl: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
