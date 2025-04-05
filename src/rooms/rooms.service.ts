import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Room } from './entities/room.entity';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class RoomsService {
  @InjectRepository(Room) private readonly roomRepository: Repository<Room>;
  @InjectRepository(Hotel) private readonly hotelRepository: Repository<Hotel>;
  async create(createRoomDto: CreateRoomDto ,i18n: I18nContext) {
    const hotel = await this.hotelRepository.findOne({ where: { id: createRoomDto.hotelId } });
    if (!hotel) throw new NotFoundException(
      await i18n.t('service.NOT_FOUND', {
        args: { module_name: i18n.lang === 'en' ? 'Hotel' : 'الفندق' },
      }),
    );
    const room = this.roomRepository.create({ ...createRoomDto, hotel });
    await this.roomRepository.save(room);
    return {
      message: await i18n.t('service.CREATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
      data: room,
    }
  }

  async findAll(i18n: I18nContext) {
    const rooms = await this.roomRepository.find({ relations: ['hotel'] });
    return {
      message: await i18n.t('service.FOUND_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Rooms' : 'الغرف' },
      }),
      data: rooms,
    }
  }

  async findOne(id: string , i18n: I18nContext) {
    const room = await this.roomRepository.findOne({ where: { id }, relations: ['hotel'] });
    if (!room) throw new NotFoundException(
      await i18n.t('service.NOT_FOUND', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
    );
    return {
      message: await i18n.t('service.FOUND_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
      data: room,
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto , i18n: I18nContext) {
    await this.roomRepository.update(id, updateRoomDto);
    const updateRoom = this.findOne(id , i18n);
    if (!updateRoom) throw new NotFoundException(
      await i18n.t('service.NOT_FOUND', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
    );
    return {
      message: await i18n.t('service.UPDATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
    }
  }

  async remove(id: string , i18n: I18nContext) {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException(
      await i18n.t('service.NOT_FOUND', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
    );
    await this.roomRepository.delete({ id });
    return {
      message: await i18n.t('service.DELETED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
      }),
    }
  }
}
