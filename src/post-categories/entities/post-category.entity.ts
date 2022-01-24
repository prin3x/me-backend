// import { News } from 'src/news/news.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum POST_CATE_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}
@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: POST_CATE_STATUS.ENABLED })
  status: POST_CATE_STATUS;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  //   @OneToMany(() => News, (_news) => _news.categoryDetail)
  //   newsDetail: News[];
}
