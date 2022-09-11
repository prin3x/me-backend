import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import { FormsRequestCategory } from 'forms-request-categories/entities/forms-request-category.entity';
import { FormsRequestCategoriesService } from 'forms-request-categories/forms-request-categories.service';
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
    private config: ConfigService,
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
          'serviceCategory.id = serviceContact.categoryId',
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
      const form = new FormsRequest();
      form.content = createForms.content;
      form.downloadLink = createForms.downloadLink;
      form.categoryId = createForms.categoryId;
      form.index = createForms.index;

      if (createForms.file) {
        form.filePath =
          this.config.get('apiAssetURL') +
          createForms?.file?.path.replace('upload', '');
      }
      await this.repo.save({ ...form, adminId: admin.id });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }

    return res;
  }

  async updateIndex(id: string, index: number) {
    this.logger.log(`Fn: ${this.update.name}, index: ${index}
    `);
    let formRequest;
    try {
      formRequest = await this.repo.findOne({ where: { id: +id } });
      if (!formRequest) throw new NotFoundException();

      const swapContact = await this.repo.findOne({
        where: { index: index, categoryId: formRequest.categoryId },
      });

      if (swapContact) {
        swapContact.index = parseInt(formRequest.index);
        formRequest.index = index;
        await this.repo.save([formRequest, swapContact]);
      } else {
        formRequest.index = index;
        await this.repo.save(formRequest);
      }
    } catch (e) {
      this.logger.error(`Fn: ${this.updateIndex.name}, id: ${id}
      `);
      throw new BadRequestException(e);
    }

    return formRequest;
  }

  async update(
    id: string,
    categoryDto: UpdateFormsRequestDto,
  ): Promise<Response> {
    this.logger.log(`Fn: ${this.update.name}, Params: ${id}, ${JSON.stringify(
      categoryDto,
    )}
    `);
    let serviceContact;
    try {
      serviceContact = await this.repo.findOne({ where: { id: +id } });
      if (!serviceContact) throw new NotFoundException();

      serviceContact = Object.assign(serviceContact, categoryDto);

      if (categoryDto.file) {
        serviceContact.filePath =
          this.config.get('apiAssetURL') +
          categoryDto?.file?.path.replace('upload', '');
      }

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
      const formRequest = await this.repo.findOne({ where: { id: +id } });
      if (!formRequest) throw new NotFoundException();

      const swapContact = await this.repo.findOne({
        where: {
          index: formRequest.index + 1,
          categoryId: formRequest.categoryId,
        },
      });

      if (swapContact) {
        swapContact.index = +formRequest.index;

        await this.repo.save(swapContact);
      }

      await this.repo.delete(id);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return category;
  }
}
