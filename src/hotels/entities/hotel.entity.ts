import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ nullable: true }) 
  image: string; 

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
  updatedAt: Date;

  // @OneToMany(() => Room, (room) => room.hotel)
  // rooms: Room[];

  // @OneToMany(() => Review, (review) => review.hotel)
  // reviews: Review[];
}
