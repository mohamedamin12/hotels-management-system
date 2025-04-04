import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';

@Controller('api/v1/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) { }

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  create(@Body() createHotelDto: CreateHotelDto, @I18n() i18n: I18nContext) {
    return this.hotelsService.create(createHotelDto, i18n);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('location') location?: string,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber?: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage?: number,
  ) {
    return this.hotelsService.findAll(name, location ,  pageNumber, perPage);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.hotelsService.findById(id, i18n);
  }

  @Put(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto, @I18n() i18n: I18nContext) {
    return this.hotelsService.update(id, updateHotelDto, i18n);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.hotelsService.remove(id, i18n);
  }
}
