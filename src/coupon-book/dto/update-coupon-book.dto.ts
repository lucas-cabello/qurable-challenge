import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponBookDto } from './create-coupon-book.dto';

export class UpdateCouponBookDto extends PartialType(CreateCouponBookDto) {}
