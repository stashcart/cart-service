import { IsDefined, IsUrl } from 'class-validator';

export class AddCartProductRequestDto {
  @IsDefined()
  customerId: number;

  @IsUrl()
  @IsDefined()
  productUrl: string;

  @IsDefined()
  amount: number;
}
