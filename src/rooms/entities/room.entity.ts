import { MeetingEvent } from 'meeting-events/entities/meeting-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ROOM_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  imageUrl: string;

  @Column()
  name: string;

  @Column({ default: 10 })
  capacity: number;

  @Column({ default: '', nullable: true })
  description: string;

  @Column({ nullable: true })
  floor: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: 0 })
  createdBy: number;

  @Column({ default: ROOM_STATUS.ENABLED })
  status: ROOM_STATUS;

  @OneToMany(() => MeetingEvent, (_room) => _room.roomId)
  meetingEventDetail: MeetingEvent[];
}
