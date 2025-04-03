import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthProvider } from './auth.provider';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) { }

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

  /**
  * Verify Email
  * @param userId id of the user from the link
  * @param verificationToken verification token from the link
  * @returns success message
  */
  public async verifyEmail(userId: number, verificationToken: string) {
    const user = await this.getCurrentUser(userId);

    if (user.verificationToken === null)
      throw new NotFoundException("there is no verification token");

    if (user.verificationToken !== verificationToken)
      throw new BadRequestException("invalid link");

    user.isAccountVerified = true;
    user.verificationToken = null;

    await this.userRepository.save(user);
    return { message: "Your email has been verified, please log in to your account" };
  }

  /**
  * sending reset password template
  * @param email  - email of the user
  * @returns a success message
  */
  async sendResetPassword(email: string) {
    return await this.authProvider.sendResetPassword(email);
  }

  /**
   * Get reset password link
   * @param userId - id of the user
   * @param resetPasswordToken - token of the reset password
   * @returns a success message
   */
  async getResetPassword(userId: number, resetPasswordToken: string) {
    return await this.authProvider.getResetPasswordLink(
      userId,
      resetPasswordToken,
    );
  }

  /**
   * reset password
   * @param dto - data for the reset password
   * @returns a success message
   */
  async resetPassword(dto: ResetPasswordDto) {
    return await this.authProvider.resetPassword(dto);
  }

  /**
 * Get current user (logged in user)
 * @param id id of the logged in user
 * @returns the user from the database
 */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("user not found");
    return user;
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
