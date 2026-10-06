import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { VerifyLandDto } from './dto/verify-land.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { LogsQueryDto } from './dto/logs-query.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../generated/prisma/client';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Land Verification
  @Get('lands/pending')
  async getPendingLands() {
    return this.adminService.getPendingLands();
  }

  @Get('lands')
  async getAllLands() {
    return this.adminService.getAllLands();
  }

  @Patch('lands/:id/verify')
  async verifyLand(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: VerifyLandDto,
  ) {
    return this.adminService.verifyLand(id, user.id, dto);
  }

  // User Management
  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto);
  }

  // Transaction Monitoring
  @Get('transactions')
  async getTransactions() {
    return this.adminService.getTransactions();
  }

  // System Logs
  @Get('logs')
  async getLogs(@Query() query: LogsQueryDto) {
    return this.adminService.getLogs(query);
  }

  // Platform Settings
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.adminService.updateSettings(user.id, dto);
  }

  // Platform Stats
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }
}
