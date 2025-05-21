import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as bcrypt from "bcrypt";
import { JwtPayloadType } from "../utils/types";
import { LoginUserDto } from "./dto/login-user.dto";
import { randomBytes } from "crypto";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { I18n, I18nContext } from "nestjs-i18n";

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) { }

  /**
   * Create a new user
   * @param registerUser data for creating a new user
   * @returns JWt (access token)
   */
  async register(registerUser: RegisterUserDto, @I18n() i18n: I18nContext) {
    const { username, email, password } = registerUser;

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException(
      await i18n.t('service.ALREADY_EXIST', {
        args: { module_name: i18n.lang === 'en' ? 'User' : 'المستخدم' },
      })
    ); // User already exists

    const hashedPassword = await this.hashedPassword(password);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    const payload = {
      id: newUser.id,
      role: newUser.role,
    };

    // Generate access token
    const accessToken = await this.generateJwt(payload);
    
    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(payload);
    
    // Save refresh token to the database
    newUser.refreshToken = refreshToken;
    await this.userRepository.save(newUser);

    return {
      message: await i18n.t('service.Registered'),
      data: newUser,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  }

  /**
   * Login user
   * @param loginUser data for login user
   * @returns JWt (access token)
   */
  async login(loginUser: LoginUserDto, @I18n() i18n: I18nContext) {
    const { email, password } = loginUser;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException(
      await i18n.t('service.Invalid_Email_Password')
    );

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new BadRequestException(
        await i18n.t('service.Invalid_Email_Password')
      );

    const payload = {
      id: user.id,
      role: user.role,
    };

    // Generate access token
    const accessToken = await this.generateJwt(payload);
    
    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(payload);
    
    // Save refresh token to the database
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      message: await i18n.t('service.LoggedIN'),
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

  }

  /**
   * sending reset password
  */
  async sendResetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException(`User with email : ${email} not found`);

    user.resetPasswordToken = randomBytes(32).toString('hex');
    const result = await this.userRepository.save(user);

    const resetPasswordLink = `${this.config.get<string>('CLIENT_DOMAIN')}/reset-password/${user.id}/${result.resetPasswordToken}`;
    this.mailService.resetPasswordTemplate(email, resetPasswordLink);
    return {
      message: 'Password rest link sent to your email, please check your inbox',
    };
  }

  /**
  * Get reset password link
  */
  async getResetPasswordLink(userId: string, resetPasswordToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("invalid link");

    if (user.resetPasswordToken === null || user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException("invalid link");
    return { message: "valid Link" }

  }

  /**
   * reset the password
   * @param dto password to reset the password
   */
  public async resetPassword(dto: ResetPasswordDto) {
    const { userId, resetPasswordToken, newPassword } = dto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("invalid link");

    if (user.resetPasswordToken === null || user.resetPasswordToken !== resetPasswordToken)
      throw new BadRequestException("invalid link");

    const hashedPassword = await this.hashedPassword(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await this.userRepository.save(user);

    return { message: 'password reset successfully, please log in' };
  }

  /**
   * hashed password
   * @param password password hashed fro user
   */
  public async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  /**
 * generate JWT token
 * @param payload jwt token
 * @returns token
 */
  /**
   * generate JWT access token
   * @param payload jwt token payload
   * @returns access token
   */
  public generateJwt(payload: JwtPayloadType) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES') || '15m'
    });
  }

  /**
   * generate JWT refresh token
   * @param payload jwt token payload
   * @returns refresh token
   */
  public generateRefreshToken(payload: JwtPayloadType) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d'
    });
  }

  /**
   * verify refresh token
   * @param refreshToken refresh token to verify
   * @returns decoded token payload
   */
  public async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET')
      });
      return payload;
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}