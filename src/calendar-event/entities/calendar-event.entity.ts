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
  categoryName: string;

  @Column({ nullable: true })
  roomIds: number;

  @Column({ type: 'varchar', nullable: true })
  hyperlink: string;

  @ManyToOne(() => Admin, { nullable: true })
  adminDetail: number;

  @ManyToOne(
    () => CalendarEventCategory,
    (_calendarCategory) => _calendarCategory.title,
  )
  @JoinColumn({ name: 'categoryName' })
  categoryDetail: CalendarEventCategory;
}
