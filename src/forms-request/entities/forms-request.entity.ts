import { FormsRequestCategory } from 'forms-request-categories/entities/forms-request-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FORM_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}
@Entity()
export class FormsRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column()
  downloadLink: string;

  @Column({ default: '', nullable: true })
  filePath: string;

  @Column({ default: FORM_STATUS.ENABLED })
  status: FORM_STATUS;

  @Column()
  adminId: number;

  @Column({ default: 0 })
  index: number;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(
    () => FormsRequestCategory,
    (serviceContactCategory) => serviceContactCategory.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'categoryId' })
  categoryDetail: number;
}
