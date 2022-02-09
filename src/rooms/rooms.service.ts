import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 's3/s3.service';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private repo: Repository<Room>,
    private s3Service: S3Service,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new Room();
    newRoom.name = createRoomDto.name;
    newRoom.floor = createRoomDto.floor;
    newRoom.description = createRoomDto.description;

    try {
      const key: any = await this.s3Service.uploadImagesS3(createRoomDto.image);

      newRoom.imageUrl = key;
      await this.repo.save(newRoom);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async findAll(): Promise<Room[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Room> {
    return await this.repo.findOne(id);
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    let newRoom;
    try {
      newRoom = await this.findOne(id);
      if (!newRoom) throw new NotFoundException();

      newRoom.name = updateRoomDto.name;
      newRoom.imageUrl = updateRoomDto.image;
      newRoom.floor = updateRoomDto.floor;
      newRoom.description = updateRoomDto.description;

      await this.repo.save(newRoom);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
