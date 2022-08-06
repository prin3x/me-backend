import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Division } from './entities/division.entity';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division)
    private repo: Repository<Division>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto) {
    let res: Division;
    const companyInstance = new Division();
    companyInstance.division = createDivisionDto.division;
    try {
      res = await this.repo.save(companyInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findAll() {
    let res: Division[];
    try {
      res = await this.repo.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOne(id: number) {
    let res: Division;
    try {
      res = await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async update(id: number, updateDivisionDto: UpdateDivisionDto) {
    let res: Division;
    const companyInstance = new Division();
    companyInstance.id = id;
    companyInstance.division = updateDivisionDto.division;
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
