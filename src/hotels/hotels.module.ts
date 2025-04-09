import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel]),
    JwtModule,
    UsersModule
  ], 
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService], 
})
export class HotelsModule {}
