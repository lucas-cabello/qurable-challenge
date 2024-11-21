import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema()
export class Coupon {
  @Prop()
  code: string;

  @Prop()
  discount: string;

  @Prop()
  used: boolean;

  @Prop()
  userId: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
