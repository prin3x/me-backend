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
      await this.repo.delete(id);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return category;
  }
}
