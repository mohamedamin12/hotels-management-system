import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { OAuthService } from './oauth.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config : ConfigService) => {
            return {
              global: true,
              secret: config.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
            };
          }
        })
  ],
  controllers: [OAuthController],
  providers: [GoogleStrategy, OAuthService],
})
export class OAuthModule { }