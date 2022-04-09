import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { base64Encode } from 'utils/fileUtils';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ListBasicOperationRoom,
  ListQueryParamsRoomDTO,
} from './dto/get-room.dto';
import { UpdateRoomDto, UpdateRoomStatusDto } from './dto/update-room.dto';
import { Room, ROOM_STATUS } from './entities/room.entity';
import * as path from 'path';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private repo: Repository<Room>,
  ) {}

  async updateStatus(_id: number, _updateRoomDto: UpdateRoomStatusDto) {
    if (!_updateRoomDto.status) return;
    let res;

    try {
      switch (_updateRoomDto.status) {
        case ROOM_STATUS.ENABLED:
          res = await this._enableRoom(_id);
          break;

        case ROOM_STATUS.DISABLED:
          res = await this._disableRoom(_id);
          break;

        default:
          break;
      }
    } catch (e) {
      throw new Error('Unable to toggle change');
    }

    return res;
  }

  async _enableRoom(id: number) {
    let res;

    const room = await this.findOne(id);
    room.status = ROOM_STATUS.ENABLED;

    try {
      res = await this.repo.save(room);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async _disableRoom(id: number) {
    let res;

    const room = await this.findOne(id);
    room.status = ROOM_STATUS.DISABLED;

    try {
      res = await this.repo.save(room);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new Room();
    newRoom.name = createRoomDto.name;
    newRoom.floor = createRoomDto.floor;
    newRoom.description = createRoomDto.description;
    newRoom.imageUrl = `${createRoomDto.image.filename}`;

    try {
      await this.repo.save(newRoom);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async findAll(opt: ListBasicOperationRoom): Promise<Room[]> {
    let res, query;
    try {
      query = this.repo.createQueryBuilder('meetingroom');
      query.where('(meetingroom.name LIKE :search)', {
        search: `%${opt.search}%`,
      });
      query.skip(opt.skip).take(opt.limit);

      res = await query.getManyAndCount();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page,
    };

    rtn.items = rtn.items.map((_item: Room) => {
      if (_item.imageUrl) {
        const imageBase64 = base64Encode(path.join('./upload', _item.imageUrl));
        _item.imageUrl = `data:image/png;base64, ${imageBase64}`;
      }
      return _item;
    });

    return rtn.items;
  }

  async findAllExcludeStatus(opt: ListBasicOperationRoom): Promise<Room[]> {
    let res, query;
    try {
      query = this.repo.createQueryBuilder('meetingroom');
      query.where('(meetingroom.name LIKE :search)', {
        search: `%${opt.search}%`,
      });
      query.skip(opt.skip).take(opt.limit);

      res = await query.getManyAndCount();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page,
    };

    rtn.items = rtn.items.map((_item: Room) => {
      if (_item.imageUrl) {
        const imageBase64 = base64Encode(path.join('./upload', _item.imageUrl));
        _item.imageUrl = `data:image/png;base64, ${imageBase64}`;
      }
      return _item;
    });

    return rtn.items;
  }

  async findByFloor(_floor: string): Promise<Room[]> {
    return await this.repo.find({ floor: _floor });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ id: id });
  }

  async findOneById(id: number): Promise<Room> {
    let res: Room;
    try {
      res = await this.repo.findOne({ id });
    } catch (error) {
      throw new NotFoundException('Id Not Found');
    }

    if (res.imageUrl) {
      const imageBase64 = base64Encode(path.join('./upload', res.imageUrl));
      res.imageUrl = `data:image/png;base64, ${imageBase64}`;
    }

    return res;
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

      if (updateRoomDto.image) {
        newRoom.imageUrl = `${updateRoomDto.image.filename}`;
      }

      await this.repo.save(newRoom);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }

  parseQueryString(q: ListQueryParamsRoomDTO): ListBasicOperationRoom {
    const rtn: ListBasicOperationRoom = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'createdDate',
      order: 'ASC',
      search: q?.search ? q?.search.trim() : '',
    };

    q.order = q?.order ? q?.order.toUpperCase() : '';
    rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
