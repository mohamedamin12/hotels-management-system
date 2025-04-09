import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { I18nContext } from 'nestjs-i18n';
import { BookingStatus, UserType } from 'src/utils/enum';



@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(createBookingDto: CreateBookingDto, user: User, i18n: I18nContext) {
    const { roomId, startDate, endDate, status } = createBookingDto;

    //* Check if the room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['hotel'],
    });

    if (!room) {
      throw new NotFoundException(
        await i18n.t('service.NOT_FOUND', {
          args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
        }),
      );
    }

    //* Check if the room is already booked during the specified time range  (inclusive)
    const overlappingBooking = await this.bookingRepository.findOne({
      where: [
        {
          room: { id: roomId },
          startDate: LessThanOrEqual(new Date(endDate)),
          endDate: MoreThanOrEqual(new Date(startDate)),
        },
      ],
    });

    if (overlappingBooking) {
      throw new BadRequestException(
        await i18n.t('service.ALREADY_BOOKED', {
          args: { module_name: i18n.lang === 'en' ? 'Room' : 'الغرفة' },
        }),
      );
    }

    //* Calculate the number of nights between start and end date  (inclusive)
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
    );

    //* Calculate the total price
    const totalPrice = nights * Number(room.price);

    //* create a new booking
    const booking = this.bookingRepository.create({
      user: { id: user.id },
      room: { id: roomId },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: user.role === UserType.ADMIN ? createBookingDto.status || BookingStatus.PENDING : BookingStatus.PENDING,
    });

    await this.bookingRepository.save(booking);
    return {
      message: await i18n.t('service.CREATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Booking' : 'الحجز' },
      }),
      data: booking,
    };
  }

  async findAll(query: any, user: User) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};


    if (user.role === UserType.User) {
      where.user = { id: user.id };
    } else if (query.userId) {
      where.user = { id: query.userId };
    }

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await this.bookingRepository.findAndCount({
      where,
      relations: ['user', 'room', 'room.hotel'],
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      data,
    };
  }

  async findOne(id: string, user: User, i18n: I18nContext) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });

    if (!booking) {
      throw new NotFoundException(
        await i18n.t('service.NOT_FOUND', {
          args: { module_name: i18n.lang === 'en' ? 'Booking' : 'الحجز' },
        }),
      );
    }

    if (user.role !== UserType.ADMIN && booking.user.id !== user.id) {
      throw new ForbiddenException(
        await i18n.t('service.ForbiddenException'),
      );
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    user: User,
    i18n: I18nContext,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!booking) {
      throw new NotFoundException({
        message: await i18n.t('service.NOT_FOUND', {
          args: { module_name: i18n.lang === 'en' ? 'Booking' : 'الحجز' },
        }),
      });
    }

    if (user.role === UserType.User && booking.user?.id !== user.id) {
      throw new ForbiddenException({
        message: await i18n.t('service.NOT_ALLOWED'),
      });
    }

    if (updateBookingDto.startDate && updateBookingDto.endDate) {
      const nights = Math.ceil(
        (new Date(updateBookingDto.endDate).getTime() -
          new Date(updateBookingDto.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      );

      booking.startDate = new Date(updateBookingDto.startDate);
      booking.endDate = new Date(updateBookingDto.endDate);
      booking.totalPrice = nights * Number(booking.room.price);
    }

    if (updateBookingDto.status) {
      booking.status = updateBookingDto.status as BookingStatus;
    }

    if (user.role === UserType.User && updateBookingDto.status) {
      throw new BadRequestException(
        await i18n.t('service.NOT_ALLOWED'),
      );
    }

    await this.bookingRepository.save(booking);

    return {
      message: await i18n.t('service.UPDATED_SUCCESS', {
        args: { module_name: i18n.lang === 'en' ? 'Booking' : 'الحجز' },
      }),
      data: booking,
    };
  }

  async cancel(id: string, user: User, i18n: I18nContext) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });

    if (!booking) {
      throw new NotFoundException({
        message: await i18n.t('service.NOT_FOUND', {
          args: { module_name: i18n.lang === 'en' ? 'Booking' : 'الحجز' },
        }),
      });
    }

    if (user.role === UserType.User && booking.user?.id !== user.id) {
      throw new ForbiddenException({
        message: await i18n.t('service.NOT_ALLOWED'),
      });
    }

    booking.status = BookingStatus.CANCELLED;

    await this.bookingRepository.save(booking);

    return {
      message: await i18n.t('service.CANCELED_SUCCESS', {
        args: { room_name: booking.room?.name || '' },
      }),
      data: booking,
    };
  }


}
