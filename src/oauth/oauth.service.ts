import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from 'src/utils/enum';
import { JwtPayloadType } from 'src/utils/types';
const saltOrRounds = 10;

type UserData = {
  userId: string;
  email: string;
  name: string;
  photo: string;
};

function generateRandomPassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  const passwordLength = Math.floor(Math.random() * (20 - 4 + 1)) + 4;

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async validateUser(userData: UserData): Promise<any> {
    // business logic
    const user = await this.userRepository.findOne({ where: { email: userData.email } });
    //sign-up=> if not, create a new user (create new token) (create new password)
    if (!user) {
      const password = await bcrypt.hash(
        generateRandomPassword(),
        saltOrRounds,
      );
      const newUser = await this.userRepository.save({
        email: userData.email,
        name: userData.name,
        avatar: userData.photo,
        password,
        role: UserType.User, 
      });
      const payload : JwtPayloadType= {
        id: newUser.id,
        role: newUser.role,
      };
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      return {
        message: 'User created successfully',
        data: newUser,
        access_token: token,
      };
    }

    //sign-in=> check if user exists in the db (create new token)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      message: 'User logged in successfully',
      data: user,
      access_token: token,
    };
  }
}
