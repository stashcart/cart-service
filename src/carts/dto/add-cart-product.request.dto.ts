import { IsDefined, IsNumber, IsUrl, Min } from 'class-validator';

export class AddCartProductRequestDto {
  @IsDefined()
  @IsNumber()
  customerId: number;

  @IsUrl()
  @IsDefined()
  productUrl: string;

  @IsDefined()
  @Min(1)
  amount: number;
}
