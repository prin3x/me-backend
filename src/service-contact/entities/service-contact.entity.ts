import { PostCategory } from 'post-categories/entities/post-category.entity';
import { ServiceContactCategory } from 'service-contact-categories/entities/service-contact-categories.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SERVICE_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class ServiceContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  objective: string;

  @Column()
  contactID: string;

  @Column({ nullable: true })
  contactPhoneNumber: string;

  @Column({ default: SERVICE_STATUS.ENABLED })
  status: SERVICE_STATUS;

  @Column()
  name: string;

  @Column()
  adminId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(
    () => ServiceContactCategory,
    (serviceContactCategory) => serviceContactCategory.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  categoryDetail: number;
}
