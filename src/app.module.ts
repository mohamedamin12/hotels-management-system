import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { OAuthModule } from './oauth/oauth.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingModule } from './booking/booking.module';
import { UploadsModule } from './uploads/uploads.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentModule } from './payment/payment.module';
import { dataSourceOptions as options } from '../db/data-source';



@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 4000, // 4 seconds
        limit: 3, // 3 requests every 4 seconds for a client
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 7 // 7 requests every 10 seconds for a client
      },
      {
        name: 'long',
        ttl: 60000, // 60 seconds
        limit: 15 // 15 requests every 60 seconds for a client
      }
    ]),

    TypeOrmModule.forRoot(options),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV !== 'production' ? `.env.${process.env.NODE_ENV}` : ".env"
    }),
    UsersModule,
    OAuthModule,
    HotelsModule,
    RoomsModule,
    BookingModule,
    UploadsModule,
    ReviewsModule,
    PaymentModule
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
  ],

})
export class AppModule { }
