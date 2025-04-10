import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
import { User } from '../users/entities/user.entity';



@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  async createStripeCheckout(amount: number, bookingId: string, userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: 'Hotel Booking Payment',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        }
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });


    await this.paymentRepository.save({
      amount,
      currency: 'egp',
      paymentMethod: 'stripe',
      status: 'pending',
      sessionId: session.id,
      booking,
      user,
    });

    return { url: session.url };

  }


  async createCashPayment(amount: number, bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return this.paymentRepository.save({
      amount,
      currency: 'egp',
      paymentMethod: 'cash',
      status: 'pending',
      booking,
      user,
    });
  }

  async confirmPaymentCash(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }


    if (payment.status === 'completed') {
      throw new BadRequestException('Payment already confirmed');
    }

    payment.status = 'completed';
    return this.paymentRepository.save(payment);
  }

  async getAllPayments() {
    const payments = await this.paymentRepository.find({
      relations: ['user', 'booking'],
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      payments,
      total: payments.length,
    };
  }

  async confirmPaymentCard(payload: any, sig: any, endpointSecret: string) {
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const payment = await this.paymentRepository.findOne({ where: { sessionId: session.id } });
        payment.status = 'completed'

        await this.paymentRepository.save(payment);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

}

