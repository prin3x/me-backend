import { FormsRequest } from 'forms-request/entities/forms-request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FORM_CATEGORY_STATUS {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  NONE = 'none',
}
@Entity()
export class FormsRequestCategory {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ default: FORM_CATEGORY_STATUS.ENABLED })
  status: FORM_CATEGORY_STATUS;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(
    () => FormsRequest,
    (formsRequest) => formsRequest.categoryDetail,
    { eager: true, cascade: true },
  )
  formsRequestDetail: FormsRequest[];
}
