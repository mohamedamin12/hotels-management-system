import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)  
  create(@Body() createRoomDto: CreateRoomDto , @I18n() i18n: I18nContext) {
    return this.roomsService.create(createRoomDto , i18n);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@I18n() i18n: I18nContext) {
    return this.roomsService.findAll(i18n);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string , @I18n() i18n: I18nContext) {
    return this.roomsService.findOne(id , i18n);
  }

  @Put(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto , @I18n() i18n: I18nContext) {
    return this.roomsService.update(id, updateRoomDto , i18n);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string , @I18n() i18n: I18nContext) {
    return this.roomsService.remove(id , i18n);
  }
}
