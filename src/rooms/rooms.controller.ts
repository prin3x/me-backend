import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto, UpdateRoomStatusDto } from './dto/update-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ListBasicOperationRoom,
  ListQueryParamsRoomDTO,
} from './dto/get-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createRoomDto: any,
  ) {
    const set: CreateRoomDto = {
      ...createRoomDto,
      image,
    };
    return this.roomsService.create(set);
  }

  @Get('/')
  getAllRooms(@Query() q: ListQueryParamsRoomDTO) {
    const queryString: ListBasicOperationRoom =
      this.roomsService.parseQueryString(q);
    return this.roomsService.findAll(queryString);
  }

  @Get('/all')
  findAllExcludeStatus(@Query() q: ListQueryParamsRoomDTO) {
    const queryString: ListBasicOperationRoom =
      this.roomsService.parseQueryString(q);
    return this.roomsService.findAllExcludeStatus(queryString);
  }

  @Get('/floor/:floor')
  findByFloor(@Param('floor') floor) {
    return this.roomsService.findByFloor(floor);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOneById(+id);
  }

  @Patch('/:id/')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const set: UpdateRoomDto = {
      ...updateRoomDto,
      image,
    };
    return this.roomsService.update(+id, set);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatus(+id, updateRoomDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
