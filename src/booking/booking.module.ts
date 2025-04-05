import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Booking } from './entities/booking.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([Room]),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
