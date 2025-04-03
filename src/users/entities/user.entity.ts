import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


import { UserType } from 'src/utils/enum';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { Exclude } from 'class-transformer';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  role: UserType;

  @Column({ default: false })
  isAccountVerified: boolean;
  
  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  profileImage: string;


}