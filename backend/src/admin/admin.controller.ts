import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { VerifyLandPlotDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../generated/prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers(@Query('role') role?: UserRole) {
    return this.adminService.findAllUsers(role);
  }

  @Get('landplots/pending')
  findPendingLandPlots() {
    return this.adminService.findPendingLandPlots();
  }

  @Patch('landplots/:id/verify')
  verifyLandPlot(@Param('id') id: string, @Body() dto: VerifyLandPlotDto) {
    return this.adminService.verifyLandPlot(id, dto);
  }
}
