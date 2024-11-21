import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponBookModule } from './coupon-book/coupon-book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('', { dbName: 'qurable-challenge' }),
    CouponBookModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
