import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() createFloorDto: CreateFloorDto) {
    return this.floorService.create(createFloorDto);
  }

  @Get()
  findAll() {
    return this.floorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') floor: string) {
    return this.floorService.findOne(floor);
  }

  @Patch(':id')
  update(@Param('id') floor: string, @Body() updateFloorDto: UpdateFloorDto) {
    return this.floorService.update(floor, updateFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') floor: string) {
    return this.floorService.remove(floor);
  }
}
