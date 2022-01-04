import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContactStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class StaffContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'profile_pic_url' })
  profilePicUrl: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: '' })
  company: string;

  @Column({ default: '' })
  department: string;

  @Column({ default: '' })
  division: string;

  @Column()
  ipPhone: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: ContactStatus.ENABLED })
  status: ContactStatus;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ default: 0 })
  createdBy: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
