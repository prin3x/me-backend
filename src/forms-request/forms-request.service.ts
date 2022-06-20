import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import { FormsRequestCategory } from 'forms-request-categories/entities/forms-request-category.entity';
import { FormsRequestCategoriesService } from 'forms-request-categories/forms-request-categories.service';
import { UpdateServiceContactDto } from 'service-contact/dto/update-service-contact.dto';
import { Repository } from 'typeorm';
import { CreateFormsRequestDto } from './dto/create-forms-request.dto';
import { UpdateFormsRequestDto } from './dto/update-forms-request.dto';
import { FormsRequest } from './entities/forms-request.entity';

@Injectable()
export class FormsRequestService {
  private readonly logger = new Logger(FormsRequestService.name);
  constructor(
    @InjectRepository(FormsRequest)
    private repo: Repository<FormsRequest>,
    private formsRequestCategoriesService: FormsRequestCategoriesService,
  ) {}

  async findAll() {
    this.logger.log(`fn: findAll`);
    let res;

    try {
      res = await this.repo
        .createQueryBuilder('serviceContact')
        .leftJoin(
          FormsRequestCategory,
          'serviceCategory',
          'serviceCategory.id = serviceContact.categoryDetail',
        )
        .getMany();
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }

    return res;
  }

  async findAllWithCategory() {
    return this.formsRequestCategoriesService.findAll();
  }

  async createOne(
    createForms: CreateFormsRequestDto,
    admin: IAuthPayload,
  ): Promise<Response> {
    this.logger.log(`fn: createOne, adminId : ${admin.id}`);
    let res: Response;
    try {
      await this.repo.save({ ...createForms, adminId: admin.id });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }

    return res;
  }

  async update(
    id: string,
    categoryDto: UpdateFormsRequestDto,
  ): Promise<Response> {
    this.logger.log(`Fn: ${this.update.name}, Params: ${id}
    `);
    let serviceContact;
    try {
      serviceContact = await this.repo.findOne({ where: { id: +id } });
      if (!serviceContact) throw new NotFoundException();

      serviceContact = { ...serviceContact, ...categoryDto };

      await this.repo.save(serviceContact);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return serviceContact;
  }

  async remove(id: string) {
    this.logger.log(`Fn: ${this.remove.name}, Params: ${id}
    `);
    let category;
    try {
      await this.repo.delete({ id: +id });
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return category;
  }
}
