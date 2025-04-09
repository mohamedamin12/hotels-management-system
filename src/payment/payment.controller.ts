import { Controller, Post, Body, UseGuards, Patch, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateStripePaymentDto } from './dto/create-stripe-payment.dto';
import { CreateCashPaymentDto } from './dto/create-cash-payment.dto';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utils/enum';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtPayloadType } from '../utils/types';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';

@Controller('api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('stripe')
  @Roles(UserType.User)
  @UseGuards(AuthRolesGuard)
  async payWithStripe(
    @Body() { amount, bookingId }: CreateStripePaymentDto,
    @CurrentUser() user: JwtPayloadType
  ) {
    return this.paymentService.createStripeCheckout(amount, bookingId, user.id);
  }

  @Post('cash')
  @Roles(UserType.User)
  @UseGuards(AuthRolesGuard)
  async payWithCash(
    @Body() { amount, bookingId }: CreateCashPaymentDto,
    @CurrentUser() user: JwtPayloadType
  ) {
    console.log('User from token:', user);
    return this.paymentService.createCashPayment(amount, bookingId, user.id);
  }


  @Patch('confirm/:paymentId')
  @Roles(UserType.User)
  @UseGuards(AuthRolesGuard)
  async confirmPayment(
    @Param('paymentId') paymentId: string,
    @CurrentUser() user: any
  ) {
    return this.paymentService.confirmPayment(paymentId, user.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }


}
