import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import { Hotel } from "../../hotels/entities/hotel.entity";
import { User } from "../../users/entities/user.entity";
import { CURRENT_TIMESTAMP } from "../../utils/constants";

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.reviews, { onDelete: "CASCADE" })
  hotel: Hotel;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true, onDelete: "CASCADE" })  
  user: User;
}