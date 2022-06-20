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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ServiceContactCategory,
  SERVICE_CONTACT_STATUS,
} from './entities/service-contact-categories.entity';

@Injectable()
export class ServiceContactCategoryService {
  private readonly logger = new Logger(ServiceContactCategoryService.name);
  constructor(
    @InjectRepository(ServiceContactCategory)
    private repo: Repository<ServiceContactCategory>,
  ) {}

  async findAll(): Promise<ServiceContactCategory[]> {
    this.logger.log(`fn: findAll`);
    let res;

    try {
      res = await this.repo.find({
        where: { status: SERVICE_CONTACT_STATUS.ENABLED },
        relations: ['serviceContactDetail'],
      });
    } catch (e) {
      this.logger.error(e);
    }

    return res;
  }

  async findByName(title: string): Promise<ServiceContactCategory> {
    let res: ServiceContactCategory;
    try {
      res = await this.repo.findOne({ where: { title } });
    } catch (e) {
      this.logger.error(e);
    }

    return res;
  }

  async createOne(
    createCategoryDTO: CreateCategoryDto,
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

  async update(id: string, categoryDto: UpdateCategoryDto) {
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
