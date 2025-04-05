import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  capacity: number;

  @ManyToOne(() => Hotel, hotel => hotel.rooms, { onDelete: 'CASCADE' })
  hotel: Hotel;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
