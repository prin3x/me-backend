import { Room } from 'rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '', nullable: true })
  description: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: 0 })
  createdBy: number;

  @Column()
  roomId: number;

  @ManyToOne(() => Room, (_room) => _room.id)
  @JoinColumn({ name: 'roomId' })
  calendarEventDetail: Room;
}
