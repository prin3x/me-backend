import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    let res: Department;
    const companyInstance = new Department();
    companyInstance.department = createDepartmentDto.department;
    try {
      res = await this.repo.save(companyInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findAll() {
    let res: Department[];
    try {
      res = await this.repo.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOne(id: number) {
    let res: Department;
    try {
      res = await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    let res: Department;
    const companyInstance = new Department();
    companyInstance.id = id;
    companyInstance.department = updateDepartmentDto.department;
    try {
      res = await this.repo.save(companyInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async remove(id: number) {
    let res;
    try {
      res = await this.repo.delete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }
}
