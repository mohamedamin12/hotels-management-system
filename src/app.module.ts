import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { OAuthModule } from './oauth/oauth.module';
import { HotelsModule } from './hotels/hotels.module';
import { Hotel } from './hotels/entities/hotel.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';


@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          database: config.get<string>("DB_DATABASE"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          port: config.get<number>("DB_PORT"),
          host: 'localhost',
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [User , Hotel , Room , Booking],
        };
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development"
      // envFilePath: process.env.NODE_ENV !== 'production' ? `.env.${process.env.NODE_ENV}` : ".env"
    }),
    UsersModule,
    OAuthModule,
    HotelsModule,
    RoomsModule,
    BookingModule
  ],

})
export class AppModule {}
