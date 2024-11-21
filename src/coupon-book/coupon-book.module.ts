import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponBookService } from './coupon-book.service';
import { CouponBookController } from './coupon-book.controller';
import { CouponBook, CouponBookSchema } from './schema/coupon-book.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CouponBook.name, schema: CouponBookSchema },
    ]),
    UserModule,
  ],
  providers: [CouponBookService],
  controllers: [CouponBookController],
})
export class CouponBookModule {}
