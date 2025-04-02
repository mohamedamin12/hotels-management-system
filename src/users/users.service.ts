import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthProvider } from './auth.provider';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

   /**
   * Create a new user
   * @param registerUser data for creating a new user
   * @returns JWt (access token)
   */
   async register(registerUser: RegisterUserDto) {
    return this.authProvider.register(registerUser);
  }

  /**
   * Login user
   * @param loginUser data for login user
   * @returns JWt (access token)
   */
  async login(loginUser: LoginUserDto) {
    return this.authProvider.login(loginUser);
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
