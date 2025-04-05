import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @CurrentUser() user, @I18n() i18n: I18nContext) {
    return this.bookingService.create(dto, user, i18n);
  }

  @Get()
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  findAll(
    @Query() query,
    @CurrentUser() user: User, 
  ) {
    return this.bookingService.findAll(query , user);
  }

  @Get(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.findOne(id, user, i18n);
  }
  

  @Put(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.update(id, dto, user, i18n);
  }
  

  @Delete(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.cancel(id, user, i18n);
  }
}
