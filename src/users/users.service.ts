import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthProvider } from './auth.provider';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtPayloadType } from '../utils/types';
import { UserType } from '../utils/enum';
import { join } from "node:path";
import { unlinkSync } from 'node:fs';

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
   * Refresh token
   * @param refreshToken refresh token provided by the user
   * @returns new access token and refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = await this.authProvider.verifyRefreshToken(refreshToken);
      
      // Find the user
      const user = await this.getCurrentUser(payload.id);
      
      // Check if the provided refresh token matches what's stored in the database
      if (user.refreshToken !== refreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }
      
      // Generate new tokens
      const newPayload = {
        id: user.id,
        role: user.role,
      };
      
      // Generate new access token
      const accessToken = await this.authProvider.generateJwt(newPayload);
      
      // Generate new refresh token
      const newRefreshToken = await this.authProvider.generateRefreshToken(newPayload);
      
      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await this.usersRepository.save(user);
      
      return {
        message: 'Tokens refreshed successfully',
        token: accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
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
    const page = Math.max(pageNumber ?? 1, 1);
    const limit = Math.max(perPage ?? 10, 1);


    const options: FindManyOptions<User> = {
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };


    if (username) {
      options.where = { username: Like(`%${username}%`) };
    }

    return await this.usersRepository.find(options);
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
  public async delete(userId: string, payload: JwtPayloadType, i18n: I18nContext) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload?.id || payload.role === UserType.ADMIN) {
      await this.usersRepository.remove(user);
      return {
        message: await i18n.t('service.DELETED_SUCCESS', {
          args: { deleted_name: i18n.lang === 'en' ? 'User' : 'المستخدم' },
        }),
      }
    }

    throw new ForbiddenException(
      await i18n.t('service.ForbiddenException')
    );
  }

    /**
   * Set Profile Image
   * @param userId id of the logged in user
   * @param newProfileImage profile image
   * @returns the user from the database
   */
    public async setProfileImage(userId: string, newProfileImage: string) {
      const user = await this.getCurrentUser(userId);
      
      if(user.profileImage === null) {
        user.profileImage = newProfileImage;
      } else {
        await this.removeProfileImage(userId);
        user.profileImage = newProfileImage;
      }
      
      return this.usersRepository.save(user);
    }

    /**
   * Remove Profile Image
   * @param userId id of the logged in user
   * @returns the user from the database
   */
  public async removeProfileImage(userId: string) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage === null)
      throw new BadRequestException("there is no profile image");

    const imagePath = join(process.cwd(), `./images/users/${user.profileImage}`);
    unlinkSync(imagePath);

    user.profileImage = null;
    return this.usersRepository.save(user);
  }
}
