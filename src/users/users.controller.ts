import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('api/v1/users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //* Post: ~/api/users/auth/register
  @Post('auth/register')
  @UseFilters(new I18nValidationExceptionFilter())
  registerUser(@Body() body: RegisterUserDto , @I18n() i18n: I18nContext) {
    return this.usersService.register(body , i18n);
  }

  //* Post: ~/api/users/auth/login
  @Post('auth/login')
  @UseFilters(new I18nValidationExceptionFilter())
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() body: LoginUserDto ,  @I18n() i18n: I18nContext) {
    return this.usersService.login(body , i18n);
  }

  @Get('test')
  async testTranslation(@I18n() i18n: I18nContext) {
    const translatedMessage = await i18n.translate('MinLength');
    return { translatedMessage };
  }

  //* GET: ~/api/users/verify-email/:id/:verificationToken
  @Get("verify-email/:id/:verificationToken")
  public verifyEmail(
    @Param('id', ParseIntPipe) id: string,
    @Param('verificationToken') verificationToken: string
  ) {
    return this.usersService.verifyEmail(id, verificationToken);
  }

  //* POST: ~/api/users/forgot-password
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.sendResetPassword(body.email);
  }

  //* GET: ~/api/users/reset-password/:id/:resetPasswordToken
  @Get("reset-password/:id/:resetPasswordToken")
  public getResetPassword(
    @Param("id", ParseIntPipe) id: string,
    @Param("resetPasswordToken") resetPasswordToken: string
  ) {
    return this.usersService.getResetPassword(id, resetPasswordToken);
  }

  //* POST: ~/api/users/reset-password
  @Post("reset-password")
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }


  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
