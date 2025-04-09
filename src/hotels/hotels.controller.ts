import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utils/enum';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('api/v1/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) { }

  //* Post ~api/v1/hotels
  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  create(@Body() createHotelDto: CreateHotelDto, @I18n() i18n: I18nContext) {
    return this.hotelsService.create(createHotelDto, i18n);
  }

  //* Get ~api/v1/hotels
  @Get()
  @ApiResponse({ status: 200, description: 'hotels fetched successfully' })
  @ApiOperation({ summary: 'Get a collection of hotels' })
  @ApiQuery({
    name: 'name',
    required: false,
    type: 'string',
    description: 'search based on hotel name'
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: 'string',
    description: 'search based on hotel location'
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    type: 'number',
    description: 'page number for pagination',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: 'number',
    description: 'number of items per page',
  })
  findAll(
    @Query('name') name?: string,
    @Query('location') location?: string,
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber?: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage?: number,
  ) {
    return this.hotelsService.findAll(name, location, pageNumber, perPage);
  }

  //* Get ~api/v1/hotels/:id
  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.hotelsService.findById(id, i18n);
  }

  //* Put ~api/v1/hotels/:id
  @Put(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto, @I18n() i18n: I18nContext) {
    return this.hotelsService.update(id, updateHotelDto, i18n);
  }

  //* Delete ~api/v1/hotels/:id
  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.hotelsService.remove(id, i18n);
  }
}
