import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private repo: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    let res: Tag;
    const tafInstance = new Tag();
    tafInstance.tag = createTagDto.tag;
    try {
      res = await this.repo.save(tafInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findAll() {
    let res: Tag[];
    try {
      res = await this.repo.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOne(id: number) {
    let res: Tag;
    try {
      res = await this.repo.findOne({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    let res: Tag;
    const tafInstance = new Tag();
    tafInstance.id = id;
    tafInstance.tag = updateTagDto.tag;
    try {
      res = await this.repo.save(tafInstance);
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
