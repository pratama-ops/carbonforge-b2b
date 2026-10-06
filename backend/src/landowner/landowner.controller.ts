import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LandownerService } from './landowner.service';
import { CreateLandPlotDto } from './dto/create-landplot.dto';
import { UpdateLandPlotDto } from './dto/update-landplot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../generated/prisma/client';

@Controller('api/landowner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDOWNER)
export class LandownerController {
  constructor(private readonly landownerService: LandownerService) {}

  @Get('lands')
  async getLands(@CurrentUser() user: AuthUser) {
    return this.landownerService.getLands(user.id);
  }

  @Get('lands/:id')
  async getLandById(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.landownerService.getLandById(user.id, id);
  }

  @Post('lands')
  async createLand(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateLandPlotDto,
  ) {
    return this.landownerService.createLand(user.id, dto);
  }

  @Put('lands/:id')
  async updateLand(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateLandPlotDto,
  ) {
    return this.landownerService.updateLand(user.id, id, dto);
  }

  @Delete('lands/:id')
  async deleteLand(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.landownerService.deleteLand(user.id, id);
  }

  @Get('portfolio')
  async getPortfolio(@CurrentUser() user: AuthUser) {
    return this.landownerService.getPortfolio(user.id);
  }

  @Get('transactions')
  async getTransactions(@CurrentUser() user: AuthUser) {
    return this.landownerService.getTransactions(user.id);
  }
}
