import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room , Hotel]),
    JwtModule,
    UsersModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
