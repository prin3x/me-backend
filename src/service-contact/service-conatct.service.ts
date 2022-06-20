import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import { ServiceContactCategory } from 'service-contact-categories/entities/service-contact-categories.entity';
import { ServiceContactCategoryService } from 'service-contact-categories/service-contact-categories.service';
import { Repository } from 'typeorm';
import { CreateServiceContactDto } from './dto/create-service-contact.dto';
import { UpdateServiceContactDto } from './dto/update-service-contact.dto';
import { ServiceContact } from './entities/service-contact.entity';

@Injectable()
export class ServiceContactService {
  private readonly logger = new Logger(ServiceContactService.name);
  constructor(
    @InjectRepository(ServiceContact)
    private repo: Repository<ServiceContact>,
    private contactCategoryService: ServiceContactCategoryService,
  ) {}

  async findAll() {
    this.logger.log(`fn: findAll`);
    let res;

    try {
      res = await this.repo
        .createQueryBuilder('serviceContact')
        .leftJoin(
          ServiceContactCategory,
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
    return this.contactCategoryService.findAll();
  }

  async createOne(
    createServiceContact: CreateServiceContactDto,
    admin: IAuthPayload,
  ): Promise<Response> {
    this.logger.log(`fn: createOne, adminId : ${admin.id}`);
    let res: Response;
    try {
      await this.repo.save({ ...createServiceContact, adminId: admin.id });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }

    return res;
  }

  async update(id: string, categoryDto: UpdateServiceContactDto) {
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
      await this.repo.delete(id);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return category;
  }
}
