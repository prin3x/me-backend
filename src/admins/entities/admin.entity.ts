import { CalendarEvent } from 'src/calendar-event/entities/calendar-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => CalendarEvent, (_calendar) => _calendar.createdBy)
  @JoinColumn({ referencedColumnName: 'createdBy' })
  calendarEventDetail: CalendarEvent[];
}
