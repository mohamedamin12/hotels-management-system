import { Module , BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { AuthProvider } from './auth.provider';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
  imports:[
    MailModule,
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
    }),

    MulterModule.register({
      storage: diskStorage({
          destination: './images/users',
          filename: (req, file, cb) => {
              const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
              const filename = `${prefix}-${file.originalname}`;
              cb(null, filename);
          }
      }),
      fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith("image")) {
              cb(null, true);
          } else {
              cb(new BadRequestException("Unsupported file format"), false);
          }
      },
      limits: { fileSize: 1024 * 1024 }
  })

  ],
  controllers: [UsersController],
  providers: [UsersService , AuthProvider],
  exports: [UsersService],

})
export class UsersModule {}
