import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import { Repository } from 'typeorm';
import { CreateFormsRequestCategoryDto } from './dto/create-forms-request-category.dto';
import { UpdateFormsRequestCategoryDto } from './dto/update-forms-request-category.dto';
import {
  FormsRequestCategory,
  FORM_CATEGORY_STATUS,
} from './entities/forms-request-category.entity';

@Injectable()
export class FormsRequestCategoriesService {
  private readonly logger = new Logger(FormsRequestCategoriesService.name);
  constructor(
    @InjectRepository(FormsRequestCategory)
    private repo: Repository<FormsRequestCategory>,
  ) {}

  async findAll(): Promise<FormsRequestCategory[]> {
    this.logger.log(`fn: findAll`);
    let res;

    try {
      res = await this.repo.find({
        where: { status: FORM_CATEGORY_STATUS.ENABLED },
        relations: ['formsRequestDetail'],
        order: {
          index: 'ASC',
          formsRequestDetail: {
            index: 'ASC',
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
    }

    return res;
  }

  async findByName(title: string): Promise<FormsRequestCategory> {
    let res: FormsRequestCategory;
    try {
      res = await this.repo.findOne({ where: { title } });
    } catch (e) {
      this.logger.error(e);
    }

    return res;
  }

  async createOne(
    createCategoryDTO: CreateFormsRequestCategoryDto,
    admin: IAuthPayload,
  ): Promise<Response> {
    this.logger.log(`fn: createOne, adminId : ${admin.id}`);
    let res: Response;
    try {
      const isDuplicatedFound = await this.findByName(createCategoryDTO.title);
      if (isDuplicatedFound) throw new ConflictException('Duplicated content');

      await this.repo.save(createCategoryDTO);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }

    return res;
  }

  async updateIndex(id: string, index: number) {
    this.logger.log(`Fn: ${this.update.name}, index: ${index}
    `);
    let serviceContact;
    try {
      serviceContact = await this.repo.findOne({ where: { id } });
      if (!serviceContact) throw new NotFoundException();

      const swapContact = await this.repo.findOne({
        where: { index: index },
      });

      swapContact.index = serviceContact.index;
      serviceContact.index = index;

      await this.repo.save([serviceContact, swapContact]);
    } catch (e) {
      this.logger.error(`Fn: ${this.updateIndex.name}, id: ${id}
      `);
      throw new BadRequestException(e);
    }

    return serviceContact;
  }

  async update(id: string, categoryDto: UpdateFormsRequestCategoryDto) {
    this.logger.log(`Fn: ${this.update.name}, Params: ${id}
    `);
    let category;
    try {
      category = await this.repo.findOne({ where: { id } });
      if (!category) throw new NotFoundException();

      category.title = categoryDto.title;

      await this.repo.save(category);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return category;
  }

  async remove(id: string) {
    this.logger.log(`Fn: ${this.remove.name}, Params: ${id}
    `);
    let category;
    try {
      const formReq = await this.repo.findOne({ where: { id: id } });
      if (!formReq) throw new NotFoundException('Unable to find target');

      const swapContact = await this.repo.findOne({
        where: { index: formReq.index + 1 },
      });

      if (swapContact) {
        swapContact.index = formReq.index;

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
