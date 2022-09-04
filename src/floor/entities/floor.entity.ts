import { Room } from 'rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('floor')
export class Floor {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: '' })
  floor: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Room, (room) => room.floorDetails)
  roomDetails: Room[];
}
