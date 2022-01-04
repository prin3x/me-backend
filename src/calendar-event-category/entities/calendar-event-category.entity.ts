import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarEventCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  category: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

//   @OneToMany(() => CalendarEvent, (_calendar) => _calendar.categoryDetail)
//   calendarEventDetail: CalendarEvent[];
// }
}