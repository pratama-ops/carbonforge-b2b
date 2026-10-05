import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandplotService } from './landplot.service';
import { CreateLandplotDto } from './dto/create-landplot.dto';
import { UpdateLandplotDto } from './dto/update-landplot.dto';

@Controller('landplot')
export class LandplotController {
  constructor(private readonly landplotService: LandplotService) {}

  @Post()
  create(@Body() createLandplotDto: CreateLandplotDto) {
    return this.landplotService.create(createLandplotDto);
  }

  @Get()
  findAll() {
    return this.landplotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landplotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLandplotDto: UpdateLandplotDto) {
    return this.landplotService.update(+id, updateLandplotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landplotService.remove(+id);
  }
}
