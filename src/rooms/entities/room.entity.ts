import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  room: string;

  @Column({ nullable: true })
  floor: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  //   @OneToMany(() => CalendarEvent, (_calendar) => _calendar.categoryDetail)
  //   calendarEventDetail: CalendarEvent[];
  // }
}
