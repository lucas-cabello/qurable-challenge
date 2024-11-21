import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CouponBook } from './schema/coupon-book.schema';
import { UserService } from '../user/user.service';
import { UserCoupon } from '../user/schema/user-coupon.schema';

@Injectable()
export class CouponBookService {
  constructor(
    @InjectModel(CouponBook.name) private couponBookModel: Model<CouponBook>,
    private readonly userService: UserService,
  ) {}

  async create(createDto: any): Promise<CouponBook> {
    const couponBook = new this.couponBookModel(createDto);
    return couponBook.save();
  }

  async findAll(): Promise<CouponBook[]> {
    return this.couponBookModel.find().exec();
  }

  async findOne(couponBookId: string): Promise<CouponBook> {
    const couponBook = await this.couponBookModel.findById(couponBookId).exec();
    if (!couponBook) {
      throw new NotFoundException('CouponBook not found');
    }
    return couponBook;
  }

  async update(couponBookId: string, updateDto: any): Promise<CouponBook> {
    const updatedCouponBook = await this.couponBookModel
      .findByIdAndUpdate(couponBookId, updateDto, { new: true })
      .exec();
    if (!updatedCouponBook) {
      throw new NotFoundException('CouponBook not found');
    }
    return updatedCouponBook;
  }

  async assignCoupon(
    couponBookId: string,
    userId: string,
  ): Promise<CouponBook> {
    const couponBook = await this.findOne(couponBookId);
    const user = await this.userService.findOne(userId);

    if (couponBook.coupons.length === couponBook.maxCouponAmount) {
      throw new BadRequestException('CouponBook has assigned all coupons');
    }

    if (
      couponBook.coupons.filter((c) => c.userId === userId).length ===
      couponBook.maxCouponPerUser
    ) {
      throw new BadRequestException(
        'UserId already has the maximum amount of coupons assigned',
      );
    }

    const couponCode = this.getRandomCouponCode();
    const couponDiscount = this.getCouponDiscount();

    const result = await this.couponBookModel.updateOne(
      {
        _id: new Types.ObjectId(couponBookId),
        // This expression verifies the two business rules before assigning a new coupon in an atomic way
        $expr: {
          $and: [
            {
              // Verify total coupons assigned is less than maxCouponAmount
              $lt: [{ $size: '$coupons' }, '$maxCouponAmount'],
            },
            {
              // Verify coupons per user limit is not exceeded
              $lt: [
                {
                  $size: {
                    $filter: {
                      input: '$coupons',
                      as: 'c',
                      cond: { $eq: ['$$c.userId', userId] },
                    },
                  },
                },
                '$maxCouponPerUser',
              ],
            },
          ],
        },
      },
      {
        $push: {
          coupons: {
            code: couponCode,
            discount: couponDiscount,
            used: false,
            userId,
          },
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('No available coupons or limit exceeded.');
    }

    user.coupons.push({
      code: couponCode,
      discount: couponDiscount,
      used: false,
      couponBookId: couponBookId,
    });
    await user.save();

    return await this.couponBookModel.findById(couponBookId).exec();
  }

  async redeemCoupon(
    couponBookId: string,
    couponCode: string,
    userId: string,
  ): Promise<CouponBook> {
    const couponBook = await this.findOne(couponBookId);
    const user = await this.userService.findOne(userId);

    const coupon = couponBook.coupons.find(
      (coupon) => coupon.code === couponCode && coupon.userId === userId,
    );

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    if (coupon.used) {
      throw new BadRequestException('Coupon has been already redeemed.');
    }

    const result = await this.couponBookModel.updateOne(
      {
        _id: new Types.ObjectId(couponBookId),
        coupons: {
          $elemMatch: { code: couponCode, userId: userId, used: false },
        },
      },
      {
        $set: { 'coupons.$.used': true },
      },
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('Coupon has been already redeemed.');
    }

    user.coupons.find((coupon) => coupon.code === couponCode).used = true;
    await user.save();

    return await this.couponBookModel.findById(couponBookId).exec();
  }

  private getRandomCouponCode() {
    // This can be replaced with some business logic that can differ between different clients.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let result = '';

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }

  private getCouponDiscount() {
    // Discount can be taken from a database configuration per client or per CouponBook, for now we are just generating a random discount.
    // Also, discounts can be totally random, or we can configure a pool of discounts per CouponBook and assign them randomly.
    // In this way we can ensure that a fixed amount of total discount is assigned per couponBook.
    const discounts = [10, 15, 20, 30];
    const randomIndex = Math.floor(Math.random() * discounts.length);
    return discounts[randomIndex];
  }
}
