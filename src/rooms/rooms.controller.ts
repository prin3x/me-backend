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
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto, UpdateRoomStatusDto } from './dto/update-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ListBasicOperationRoom,
  ListQueryParamsRoomDTO,
} from './dto/get-room.dto';
import { Roles } from 'auth/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createRoomDto: any,
    @AuthPayload() admin: IAuthPayload,
  ) {
    const set: CreateRoomDto = {
      ...createRoomDto,
      image,
    };
    return this.roomsService.create(set, admin);
  }

  @Roles([ADMIN_ROLES.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/')
  getAllRooms(@Query() q: ListQueryParamsRoomDTO) {
    const queryString: ListBasicOperationRoom =
      this.roomsService.parseQueryString(q);
    return this.roomsService.findAll(queryString);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/all')
  findAllExcludeStatus(@Query() q: ListQueryParamsRoomDTO) {
    const queryString: ListBasicOperationRoom =
      this.roomsService.parseQueryString(q);
    return this.roomsService.findAllExcludeStatus(queryString);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/floor/:floor')
  findByFloor(@Param('floor') floor) {
    return this.roomsService.findByFloor(floor);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOneById(+id);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatus(+id, updateRoomDto);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
