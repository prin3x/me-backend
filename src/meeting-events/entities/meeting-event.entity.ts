import { Room } from 'rooms/entities/room.entity';
import { StaffContact } from 'staff-contacts/entities/staff-contact.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MeetingEventType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

@Entity()
export class MeetingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '', nullable: true })
  description: string;

  @Column()
  type: MeetingEventType;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  allDay: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: 0 })
  createdBy: number;

  @Column()
  roomId: number;

  @ManyToOne(() => StaffContact, (_staff) => _staff.id)
  @JoinColumn({ name: 'createdBy' })
  staffContactDetail: StaffContact;

  @ManyToOne(() => Room, (_room) => _room.id)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
