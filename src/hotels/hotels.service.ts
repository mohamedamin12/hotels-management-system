import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) { }
  async create(createHotelDto: CreateHotelDto, i18n: I18nContext) {
    const hotel = this.hotelRepository.create(createHotelDto);
    await this.hotelRepository.save(hotel);
    return {
      message: await i18n.t('service.CREATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Hotel' : 'الفندق' },
      }),
      data: hotel,
    };
  }

  async findAll(name?: string, location?:string , pageNumber?: number, perPage?: number) {
    const page = Math.max(pageNumber ?? 1, 1);
    const limit = Math.max(perPage ?? 10, 1);

    const options: FindManyOptions<Hotel> = {
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    if (name) {
      options.where = { name: Like(`%${name}%`) };
    }

    if (location) {
      options.where = { location: Like(`%${location}%`) };
    }

    return await this.hotelRepository.find(options);

  }

  async findById(id: string, i18n: I18nContext) {
    const hotel = await this.hotelRepository.findOne({ where: { id } , relations: ['rooms'] });
    if (!hotel) throw new NotFoundException(
      await i18n.t('service.NOT_FOUND', {
        args: { module_name: i18n.lang === 'en' ? 'Hotel' : 'الفندق' },
      }),
    );
    return {
      message: await i18n.t('service.FOUND_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Hotel' : 'الفندق' },
      }),
      data: hotel,
    };
  }

  async update(id: string, updateHotelDto: UpdateHotelDto, i18n: I18nContext) {
    const hotel = await this.findById(id, i18n);

    hotel.data.name = updateHotelDto.name ?? hotel.data.name;
    hotel.data.location = updateHotelDto.location ?? hotel.data.location;
    hotel.data.description = updateHotelDto.description ?? hotel.data.description;
    hotel.data.rating = updateHotelDto.rating ?? hotel.data.rating;

    return await this.hotelRepository.save(hotel.data);
  }

  async remove(id: string, i18n: I18nContext) {
    const hotel = await this.findById(id, i18n);
    await this.hotelRepository.remove(hotel.data);
    return {
      message: await i18n.t('service.DELETED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Hotel' : 'الفندق' },
      })
    };
  }
}
