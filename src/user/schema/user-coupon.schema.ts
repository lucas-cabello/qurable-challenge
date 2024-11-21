import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserCouponDocument = HydratedDocument<UserCoupon>;

@Schema()
export class UserCoupon {
  @Prop()
  code: string;

  @Prop()
  discount: number;

  @Prop()
  used: boolean;

  @Prop()
  couponBookId: string;
}

export const UserCouponSchema = SchemaFactory.createForClass(UserCoupon);
