import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthProvider } from './auth.provider';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtPayloadType } from 'src/utils/types';
import { UserType } from 'src/utils/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authProvider: AuthProvider
  ) { }

  /**
    * Create a new user
    * @param registerUser data for creating a new user
    * @returns JWt (access token)
  */
  async register(registerUser: RegisterUserDto, @I18n() i18n: I18nContext) {
    return this.authProvider.register(registerUser, i18n);
  }

  /**
     * Login user
     * @param loginUser data for login user
     * @returns JWt (access token)
   */
  async login(loginUser: LoginUserDto, @I18n() i18n: I18nContext) {
    return this.authProvider.login(loginUser, i18n);
  }

  /**
    * Verify Email
    * @param userId id of the user from the link
    * @param verificationToken verification token from the link
    * @returns success message
  */
  public async verifyEmail(userId: string, verificationToken: string) {
    const user = await this.getCurrentUser(userId);

    if (user.verificationToken === null)
      throw new NotFoundException("there is no verification token");

    if (user.verificationToken !== verificationToken)
      throw new BadRequestException("invalid link");

    user.isAccountVerified = true;
    user.verificationToken = null;

    await this.usersRepository.save(user);
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
  async getResetPassword(userId: string, resetPasswordToken: string) {
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
  public async getCurrentUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("user not found");
    return user;
  }


  /**
   * Get All users
   * @returns collection of users
   */
  async findAll(username?: string, pageNumber?: number, perPage?: number) {
    return await this.usersRepository.find({
      where: { username: Like(`%${username}%`) },
      skip: (pageNumber - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
    });
  }

  /**
    * Create a new user
    * @param body - the body of the request object
    * @returns - the new user
  */
  async create(body: CreateUserDto, @I18n() i18n: I18nContext) {
    const { username, email, password, role } = body;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException(
      await i18n.t('service.ALREADY_EXIST', {
        args: { module_name: i18n.lang === 'en' ? 'User' : 'المستخدم' },
      })
    );
    const hashedPassword = await this.authProvider.hashedPassword(password);
    const newUser = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await this.usersRepository.save(newUser);
    return {
      message: await i18n.t('service.CREATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'User' : 'المستخدم' },
      }),
      user: newUser,
    };
  }

  /**
     * Update user
     * @param id id of the logged in user
     * @param updateUserDto data for updating the user
     * @returns updated user from the database
   */
  public async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, username } = updateUserDto;
    const user = await this.usersRepository.findOne({ where: { id } });

    user.username = username ?? user.username;
    if (password) {
      user.password = await this.authProvider.hashedPassword(password);
    }

    return this.usersRepository.save(user);
  }

  /**
    * Delete user
    * @param userId id of the user 
    * @param payload JWTPayload
    * @returns a success message
  */
  public async delete(userId: string, payload: JwtPayloadType , i18n: I18nContext) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload?.id || payload.role === UserType.ADMIN) {
      await this.usersRepository.remove(user);
      return { message: 'User has been deleted' }
    }

    throw new ForbiddenException(
      await i18n.t('service.ForbiddenException')
    );
  }
}
