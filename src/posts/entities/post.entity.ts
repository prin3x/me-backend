import { PostCategory } from 'post-categories/entities/post-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum POST_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number | string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: POST_STATUS.ENABLED })
  status: POST_STATUS;

  @Column({ default: 0 })
  adminId: number;

  @Column()
  categoryName: string;

  @Column()
  slug: string;

  @Column()
  tag: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => PostCategory, (_PostCategory) => _PostCategory.title)
  @JoinColumn()
  categoryDetail: number;
}
