import { MeetingEvent } from 'meeting-events/entities/meeting-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  imageUrl: string;

  @Column()
  name: string;

  @Column({ default: '', nullable: true })
  description: string;

  @Column({ nullable: true })
  floor: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: 0 })
  createdBy: number;

  @OneToMany(() => MeetingEvent, (_room) => _room.roomId)
  meetingEventDetail: MeetingEvent[];
}
