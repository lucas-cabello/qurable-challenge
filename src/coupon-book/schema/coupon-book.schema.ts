import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Coupon, CouponSchema } from './coupon.schema';

@Schema()
export class CouponBook {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  maxCouponAmount: number;

  @Prop()
  maxCouponPerUser: number;

  @Prop({ type: [CouponSchema], _id: false })
  coupons: Coupon[];
}

export const CouponBookSchema = SchemaFactory.createForClass(CouponBook);

export type CouponBookDocumentOverride = {
  name: Types.DocumentArray<Coupon>;
};

export type CouponBookDocument = HydratedDocument<
  CouponBook,
  CouponBookDocumentOverride
>;
