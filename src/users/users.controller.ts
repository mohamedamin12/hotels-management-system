import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, UseFilters, Query, UseGuards, Put, DefaultValuePipe, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiBody, ApiConsumes, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayloadType } from '../utils/types';
import { UserType } from '../utils/enum';
import { Roles } from './decorators/user-role.decorator';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from "./dto/image-upload.dto";
import { Response } from 'express';

@Controller('api/v1/users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //* Post: ~/api/v1/users/auth/register
  @Post('auth/register')
  registerUser(@Body() body: RegisterUserDto, @I18n() i18n: I18nContext) {
    return this.usersService.register(body, i18n);
  }

  //* Post: ~/api/v1/users/auth/login
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() body: LoginUserDto, @I18n() i18n: I18nContext) {
    return this.usersService.login(body, i18n);
  }

  //* GET: ~/api/v1/users/verify-email/:id/:verificationToken
  @Get("verify-email/:id/:verificationToken")
  public verifyEmail(
    @Param('id', ParseIntPipe) id: string,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.usersService.verifyEmail(id, verificationToken);
  }

  //* POST: ~/api/v1/users/forgot-password
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.sendResetPassword(body.email);
  }

  //* GET: ~/api/v1/users/reset-password/:id/:resetPasswordToken
  @Get("reset-password/:id/:resetPasswordToken")
  public getResetPassword(
    @Param("id") id: string,
    @Param("resetPasswordToken") resetPasswordToken: string
  ) {
    return this.usersService.getResetPassword(id, resetPasswordToken);
  }

  //* POST: ~/api/v1/users/reset-password
  @Post("reset-password")
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }

  //* Post ~/api/v1/users
  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  create(@Body() createUserDto: CreateUserDto, @I18n() i18n: I18nContext) {
    return this.usersService.create(createUserDto, i18n);
  }

  //* GET ~/api/v1/users
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'Filter by title',
    type: String,
  })
  getAllUsers(
    @Query('username') username?: string,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber?: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage?: number,
  ) {
    return this.usersService.findAll(username, pageNumber, perPage);
  }

  //* GET: ~/api/v1/users/current-user
  @Get("current-user")
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  findOne(@CurrentUser() payload: JwtPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }

  //* PUT: ~/api/v1/users
  @Put()
  @Roles(UserType.ADMIN, UserType.User)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  update(@CurrentUser() payload: JwtPayloadType, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(payload.id, updateUserDto);
  }

  //* Delete: ~/api/v1/users/:id
  @Delete(":id")
  @Roles(UserType.ADMIN, UserType.User)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  remove(
    @Param('id') id: string,
    @CurrentUser() payload: JwtPayloadType,
    @I18n() i18n: I18nContext,
  ) {
    return this.usersService.delete(id, payload, i18n);
  }

  //* POST: ~/api/v1/users/upload-image
  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('user-image'))
  @ApiSecurity('bearer')
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: ImageUploadDto, description: 'profile image' })
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayloadType) {
    if (!file) throw new BadRequestException("no image provided");
    return this.usersService.setProfileImage(payload.id, file.filename);
  }

  //* DELETE: ~/api/v1/users/images/remove-profile-image
  @Delete("images/remove-profile-image")
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public removeProfileImage(@CurrentUser() payload: JwtPayloadType) {
    return this.usersService.removeProfileImage(payload.id);
  }

  //* GET: ~/api/v1/users/images/:image
  @Get("images/:image")
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public showProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/users' })
  }

}
