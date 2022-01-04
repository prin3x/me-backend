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

  @Column({ default: '' })
  start: string;

  @Column({ default: '' })
  end: string;

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

  //   @ManyToOne(() => Admin, { nullable: true })
  //   adminDetail: number;

  //   @ManyToOne(
  //     () => CalendarEventCategory,
  //     (_calendarCategory) => _calendarCategory.calendarEventDetail,
  //   )
  //   @JoinColumn({ name: 'category_id' })
  //   categoryDetail: CalendarEventCategory;

  // @ManyToOne(
  //   () => CalendarEventCategory,
  //   (_calendarCategory) => _calendarCategory.calendarEventDetail,
  // )
  // @JoinColumn({ name: 'roomIds' })
  // roomDetail: Rooms;
}
