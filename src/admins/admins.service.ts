import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private repo: Repository<Admin>) {}

  async findAll(): Promise<Admin[]> {
    return this.repo.find();
  }

  async findOne(_username): Promise<Admin> {
    return this.repo.findOne({ username: _username });
  }

  async regisAdmin(registerAdminDto: RegisterAdminDto) {
    const admin = new Admin();
    admin.username = registerAdminDto.username;
    admin.password = await bcrypt.hash(registerAdminDto.password, 3);

    return await this.repo.save(admin);
  }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
