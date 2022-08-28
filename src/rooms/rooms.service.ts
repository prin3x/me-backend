import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ListBasicOperationRoom,
  ListQueryParamsRoomDTO,
} from './dto/get-room.dto';
import { UpdateRoomDto, UpdateRoomStatusDto } from './dto/update-room.dto';
import { Room, ROOM_STATUS } from './entities/room.entity';
import { RTN_MODEL } from 'utils/rtn.model';
import { IAuthPayload } from 'auth/auth.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  constructor(
    @InjectRepository(Room)
    private repo: Repository<Room>,
    private config: ConfigService,
  ) {}

  async updateStatus(_id: number, _updateRoomDto: UpdateRoomStatusDto) {
    this.logger
      .log(`Fn: ${this._disableRoom.name}, Params: ${_updateRoomDto.status}
    `);
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
      this.logger.error(`Fn: ${this._enableRoom.name}, Params: ${id}
    `);
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
      this.logger.error(`Fn: ${this._disableRoom.name}, Params: ${id}
    `);
      throw Error(e);
    }

    return res;
  }

  async create(
    createRoomDto: CreateRoomDto,
    admin: IAuthPayload,
  ): Promise<Room> {
    this.logger
      .log(`Fn: ${this.create.name}, Params: ${createRoomDto.name}, User: ${admin.id}
    `);
    const newRoom = new Room();
    newRoom.name = createRoomDto.name;
    newRoom.floor = createRoomDto.floor;
    newRoom.description = createRoomDto.description;
    newRoom.imageUrl =
      this.config.get('apiAssetURL') +
      `${createRoomDto.image.path}`.replace('upload', '');
    newRoom.createdBy = admin.id;
    newRoom.capacity = createRoomDto.capacity;

    try {
      await this.repo.save(newRoom);
    } catch (e) {
      this.logger
        .error(`Fn: ${this.findOneById.name}, Params: ${createRoomDto.name}, User: ${admin.id}
      `);
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async findAll(opt: ListBasicOperationRoom): Promise<RTN_MODEL> {
    this.logger.log(`Fn => ${this.findAll.name}`);

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

    return rtn;
  }

  async findAllExcludeStatus(opt: ListBasicOperationRoom): Promise<Room[]> {
    this.logger.log(`Fn: ${this.findAllExcludeStatus.name}`);

    let res, query;
    try {
      query = this.repo.createQueryBuilder('meetingroom');
      query.where('meetingroom.status LIKE :status', {
        status: 'enabled',
      });
      query.andWhere('(meetingroom.name LIKE :search)', {
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

    return rtn.items;
  }

  async findByFloor(_floor: string): Promise<Room[]> {
    if (_floor === '0') return await this.repo.find();
    return await this.repo.find({ where: { floor: _floor } });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id: id } });
  }

  async findOneById(id: number): Promise<Room> {
    this.logger.log(`Fn: ${this.findOneById.name}, Params: ${id}
    `);
    let res: Room;
    try {
      res = await this.repo.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Fn: ${this.findOneById.name}, Params: ${id}`);
      throw new NotFoundException('Id Not Found');
    }

    return res;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    this.logger.log(`Fn: ${this.update.name}, Params: ${id}
    `);
    let newRoom;
    try {
      newRoom = await this.findOne(id);
      if (!newRoom) throw new NotFoundException();

      const newRoomAfterUpdate = Object.assign(newRoom, updateRoomDto);

      if (updateRoomDto.image) {
        newRoomAfterUpdate.imageUrl =
          this.config.get('apiAssetURL') +
          `${updateRoomDto.image.path}`.replace('upload', '');
      }

      await this.repo.save(newRoom);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: ${id}
      `);
      throw new BadRequestException(e);
    }

    return newRoom;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}, Params: ${id}
    `);
    let res;
    try {
      const found = await this.repo.findOne({ where: { id } });
      res = await this.repo.remove(found);
    } catch (error) {
      this.logger.error(`Fn: ${this.remove.name}, Params: ${id}
      `);
      throw new BadRequestException(error);
    }
    return res;
  }

  parseQueryString(q: ListQueryParamsRoomDTO): ListBasicOperationRoom {
    const rtn: ListBasicOperationRoom = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 100,
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
