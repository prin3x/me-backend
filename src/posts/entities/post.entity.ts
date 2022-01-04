import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: PostStatus.ENABLED })
  status: PostStatus;

  @Column({ default: 0 })
  adminId: number;

  @Column()
  categoryId: number;

  @Column()
  slug: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  //   @ManyToOne(() => PostCategory, (_PostCategory) => _PostCategory.PostDetail)
  //   @JoinColumn()
  //   categoryDetail: number;
}
