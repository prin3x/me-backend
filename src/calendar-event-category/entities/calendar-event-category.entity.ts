import { CalendarEvent } from 'calendar-event/entities/calendar-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarEventCategory {
  @PrimaryColumn()
  title: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => CalendarEvent, (_calendar) => _calendar.categoryName)
  calendarEventDetail: CalendarEvent[];
}
