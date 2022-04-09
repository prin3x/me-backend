import { MeetingEvent } from 'meeting-events/entities/meeting-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CONTACT_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class StaffContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  profilePicUrl: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  nameTH: string;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: '' })
  company: string;

  @Column({ default: '' })
  department: string;

  @Column({ default: '' })
  division: string;

  @Column({ default: '' })
  ipPhone: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  position: string;

  @Column({ default: '' })
  staffId: string;

  @Column({ default: '' })
  section: string;

  @Column({ default: CONTACT_STATUS.ENABLED })
  status: CONTACT_STATUS;

  @Column({ nullable: true })
  birthDate: string;

  @Column()
  hash: string;

  @Column({ default: 0 })
  createdBy: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(
    () => MeetingEvent,
    (_meetingEvent) => _meetingEvent.staffContactDetail,
  )
  meetingEvent: MeetingEvent[];
}
