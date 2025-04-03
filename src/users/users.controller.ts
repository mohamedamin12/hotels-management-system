import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/v1/users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //* Post: ~/api/users/auth/register
  @Post('auth/register')
  registerUser(@Body() body: RegisterUserDto) {
    return this.usersService.register(body);
  }

  //* Post: ~/api/users/auth/login
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() body: LoginUserDto) {
    return this.usersService.login(body);
  }

  //* GET: ~/api/users/verify-email/:id/:verificationToken
  @Get("verify-email/:id/:verificationToken")
  public verifyEmail(
    @Param('id', ParseIntPipe) id: number,
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
    @Param("id", ParseIntPipe) id: number,
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
