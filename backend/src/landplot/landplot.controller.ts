import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LandplotService } from './landplot.service';
import { CreateLandplotDto } from './dto/create-landplot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('landplots')
export class LandplotController {
  constructor(private readonly landplotService: LandplotService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDOWNER')
  async create(@Body() dto: CreateLandplotDto, @Request() req) {
    return this.landplotService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.landplotService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.landplotService.findOne(id);
  }
}
