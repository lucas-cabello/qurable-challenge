import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CouponBookService } from './coupon-book.service';
import { CouponBook } from './schema/coupon-book.schema';
import { CreateCouponBookDto } from './dto/create-coupon-book.dto';
import { UpdateCouponBookDto } from './dto/update-coupon-book.dto';

@Controller('coupon-book')
export class CouponBookController {
  constructor(private readonly couponBookService: CouponBookService) {}

  @Post()
  create(@Body() createDto: CreateCouponBookDto): Promise<CouponBook> {
    return this.couponBookService.create(createDto);
  }

  @Get()
  findAll(): Promise<CouponBook[]> {
    return this.couponBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CouponBook> {
    return this.couponBookService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCouponBookDto,
  ): Promise<CouponBook> {
    return this.couponBookService.update(id, updateDto);
  }

  @Post(':id/assign')
  assignCoupon(
    @Param('id') id: string,
    @Body() { userId }: any,
  ): Promise<CouponBook> {
    return this.couponBookService.assignCoupon(id, userId);
  }

  @Post(':id/redeem')
  redeemCoupon(
    @Param('id') id: string,
    @Body() { couponCode, userId }: any,
  ): Promise<CouponBook> {
    return this.couponBookService.redeemCoupon(id, couponCode, userId);
  }
}
