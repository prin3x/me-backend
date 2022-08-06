import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    let res: Company;
    const companyInstance = new Company();
    companyInstance.company = createCompanyDto.company;
    try {
      res = await this.repo.save(companyInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findAll() {
    let res: Company[];
    try {
      res = await this.repo.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOne(id: number) {
    let res: Company;
    try {
      res = await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    let res: Company;
    const companyInstance = new Company();
    companyInstance.id = id;
    companyInstance.company = updateCompanyDto.company;
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
