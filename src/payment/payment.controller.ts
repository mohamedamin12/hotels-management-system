import { Controller, Post, Body, UseGuards, Patch, Param, Get, Headers, Req, RawBodyRequest } from '@nestjs/common';
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
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async confirmPaymentCash(
    @Param('paymentId') paymentId: string,
    @CurrentUser() user: any
  ) {
    return this.paymentService.confirmPaymentCash(paymentId, user.id);
  }


  @Post()
  confirmPaymentCard(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const endpointSecret =
      'whsec_05786c1488263669988a7a4e4d3c30fdf1ba2ee8d838325622461b5623bfec5e';

    const payload = request.rawBody;

    return this.paymentService.confirmPaymentCard(payload, sig, endpointSecret);
  }


  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }


}
