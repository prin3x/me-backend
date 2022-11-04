import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, ADMIN_STATUS } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ListBasicOperation } from 'utils/query.dto';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  constructor(@InjectRepository(Admin) private repo: Repository<Admin>) {}

  async findAll(opt: ListBasicOperation) {
    this.logger.log(`Fn: ${this.findAll.name}`);
    let res;
    try {
      res = await this.repo
        .createQueryBuilder('Admin')
        .where('Admin.username LIKE :name', { name: `%${opt.search}%` })
        .skip(opt.skip)
        .take(opt.limit)
        .orderBy('Admin.role', 'DESC')
        .getManyAndCount();
    } catch (e) {
      this.logger.error(`Fn: ${this.findAll.name}`);
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page || 1,
    };

    return rtn;
  }

  async findOne(_username: string): Promise<Admin> {
    return this.repo.findOne({ where: { username: _username } });
  }

  async findOneById(id: number): Promise<Admin> {
    return this.repo.findOne({ where: { id } });
  }

  async regisAdmin(registerAdminDto: RegisterAdminDto) {
    const admin = new Admin();
    admin.username = registerAdminDto.username;
    admin.role = registerAdminDto.role;
    admin.password = await bcrypt.hash(registerAdminDto.password, 3);

    return await this.repo.save(admin);
  }

  async changePassword(id: number, password: string) {
    this.logger.log(`Fn: ${this.changePassword.name}`);
    let res;

    const adminInstance = await this.findOneById(id);
    if (!adminInstance) throw new NotFoundException();

    adminInstance.password = await bcrypt.hash(password, 3);

    try {
      res = await this.repo.save(adminInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.changePassword.name}`);
      throw Error(e);
    }

    return res;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    this.logger.log(`Fn: ${this.update.name}`);
    let res;

    const adminInstance = await this.findOneById(id);
    if (!adminInstance) throw new NotFoundException();
    adminInstance.role = updateAdminDto.role;

    try {
      res = await this.repo.save(adminInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}`);
      throw Error(e);
    }

    return res;
  }

  async updateStatus(id: number, status: ADMIN_STATUS) {
    this.logger.log(`Fn: ${this.updateStatus.name}, status: ${status}`);
    let res;

    const adminInstance = await this.findOneById(id);
    if (!adminInstance) throw new NotFoundException();

    adminInstance.status = status;

    try {
      res = await this.repo.save(adminInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.changePassword.name}`);
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}`);
    let res;

    try {
      res = await this.repo.delete({ id });
    } catch (e) {
      this.logger.error(`Fn: ${this.remove.name}`);
      throw Error(e);
    }

    if (res.affected < 1) {
      throw new BadRequestException('Cannot Find This ID');
    }

    return res;
  }
}
