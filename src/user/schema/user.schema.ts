import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserCoupon, UserCouponSchema } from './user-coupon.schema';

@Schema()
export class User {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: [UserCouponSchema], _id: false })
  coupons: UserCoupon[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocumentOverride = {
  name: Types.DocumentArray<UserCoupon>;
};

export type UserDocument = HydratedDocument<User, UserDocumentOverride>;
