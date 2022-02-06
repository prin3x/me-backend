import { Admin } from 'admins/entities/admin.entity';
import { CalendarEventCategory } from 'calendar-event-category/entities/calendar-event-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ default: '', nullable: true })
  description: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ nullable: true })
  allDay: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ default: 0 })
  createdBy: number;

  @Column()
  categoryId: number;

  @Column({ nullable: true })
  roomIds: number;

  @ManyToOne(() => Admin, { nullable: true })
  adminDetail: number;

  @ManyToOne(
    () => CalendarEventCategory,
    (_calendarCategory) => _calendarCategory.calendarEventDetail,
  )
  @JoinColumn({ name: 'categoryId' })
  categoryDetail: CalendarEventCategory;
}
