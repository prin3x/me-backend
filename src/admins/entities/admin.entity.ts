import { ADMIN_ROLES } from 'auth/roles.guard';
import { CalendarEvent } from 'calendar-event/entities/calendar-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ADMIN_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: ADMIN_STATUS.ENABLED })
  status: ADMIN_STATUS;

  @Column({ default: ADMIN_ROLES.ADMIN })
  role: ADMIN_ROLES;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => CalendarEvent, (_calendar) => _calendar.createdBy)
  @JoinColumn({ referencedColumnName: 'createdBy' })
  calendarEventDetail: CalendarEvent[];
}
