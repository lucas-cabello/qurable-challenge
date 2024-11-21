import { IsNotEmpty } from 'class-validator';

export class CreateCouponBookDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  maxCouponAmount: number;

  @IsNotEmpty()
  maxCouponPerUser: number;
}
