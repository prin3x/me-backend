import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { Floor } from './entities/floor.entity';

@Injectable()
export class FloorService {
  private logger = new Logger(FloorService.name);
  constructor(
    @InjectRepository(Floor)
    private repo: Repository<Floor>,
  ) {}

  async create(createFloorDto: CreateFloorDto) {
    let res: Floor;
    const floorInstance = new Floor();
    floorInstance.floor = createFloorDto.floor;
    try {
      res = await this.repo.save(floorInstance);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findAll() {
    let res: Floor[] = [];
    try {
      res = await this.repo.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOne(id: string) {
    let res: Floor;
    try {
      res = await this.repo.findOne({ where: { id: `${id}` } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async findOneByFloorName(floor: string) {
    let res: Floor;
    try {
      res = await this.repo.findOne({ where: { floor: `${floor}` } });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async update(id: string, updateFloorDto: UpdateFloorDto) {
    let res: Floor;
    const floorInstance = this.repo.findOne({ where: { id: `${id}` } });
    const updatedFloor = Object.assign(floorInstance, updateFloorDto);
    try {
      res = await this.repo.save(updatedFloor);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }

  async remove(id: string) {
    this.logger.log(id);
    let res;
    try {
      const found = await this.repo.findOne({ where: { id: `${id}` } });
      res = await this.repo.remove(found);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return res;
  }
}
