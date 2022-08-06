// import { News } from 'src/news/news.entity';
import { Post } from 'posts/entities/post.entity';
import { ServiceContact } from 'service-contact/entities/service-contact.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SERVICE_CONTACT_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}
@Entity()
export class ServiceContactCategory {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ default: SERVICE_CONTACT_STATUS.ENABLED })
  status: SERVICE_CONTACT_STATUS;

  @Column({ default: 0 })
  index: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(
    () => ServiceContact,
    (serviceContact) => serviceContact.categoryDetail,
    { eager: true, cascade: true },
  )
  serviceContactDetail: ServiceContact[];
}
