import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


import { UserType } from 'src/utils/enum';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { Exclude } from 'class-transformer';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, default: null })
  profileImage: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.Student })
  role: UserType;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({ nullable: true })
  verifictionToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}