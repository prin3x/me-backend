import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ default: CONTACT_STATUS.ENABLED })
  status: CONTACT_STATUS;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ default: 0 })
  createdBy: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
