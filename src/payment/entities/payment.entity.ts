// src/modules/payment/entities/payment.entity.ts

import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';


@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentMethod: 'stripe' | 'cash';

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @ManyToOne(() => Booking, (booking) => booking.payments, { eager: true })
  booking: Booking;

  @ManyToOne(() => User, (user) => user.payments, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
