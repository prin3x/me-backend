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
        order: {
          index: 'ASC',
          serviceContactDetail: {
            index: 'ASC',
          },
        },
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
      this.logger.error(`Fn: ${this.update.name}, id: ${id}
      `);
      throw new BadRequestException(e);
    }

    return serviceContact;
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
      const serviceContact = await this.repo.findOne({ where: { id: id } });
      if (!serviceContact) throw new NotFoundException('Unable to find target');

      const swapContact = await this.repo.findOne({
        where: { index: serviceContact.index + 1 },
      });

      if (swapContact) {
        swapContact.index = serviceContact.index;

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
