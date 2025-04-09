import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, Put, BadRequestException, RawBody, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  //* Post ~api/v1/booking
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post()
  @ApiSecurity('bearer')
  create(@Body() dto: CreateBookingDto, @CurrentUser() user, @I18n() i18n: I18nContext) {
    return this.bookingService.create(dto, user, i18n);
  }

  //* Get ~api/v1/booking
  @Get()
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiResponse({ status: 200, description: 'bookings fetched successfully' })
  @ApiOperation({ summary: 'Get a collection of bookings' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'number of items per page',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: 'number',
    description: 'number of items to skip',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    description: 'booking status',
  })
  findAll(
    @Query() query,
    @CurrentUser() user: User,
  ) {
    return this.bookingService.findAll(query, user);
  }

  //* Get ~api/v1/booking/:id
  @Get(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.findOne(id, user, i18n);
  }

 //* PUT: ~api/v1/booking/:id
  @Put(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.update(id, dto, user, i18n);
  }


  //* Delete: ~api/v1/booking/:id
  @Delete(':id')
  @Roles(UserType.User, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext
  ) {
    return this.bookingService.cancel(id, user, i18n);
  }

}
