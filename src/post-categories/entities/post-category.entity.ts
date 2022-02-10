// import { News } from 'src/news/news.entity';
import { Post } from 'posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum POST_CATE_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}
@Entity()
export class PostCategory {
  @PrimaryColumn()
  title: string;

  @Column({ default: POST_CATE_STATUS.ENABLED })
  status: POST_CATE_STATUS;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Post, (_post) => _post.categoryDetail)
  newsDetail: Post[];
}
