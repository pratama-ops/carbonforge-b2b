import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ========== PROTECTED ROUTES (Example) ==========

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    return {
      message: 'Profile accessed successfully',
      user: req.user,
    };
  }

  @Get('exporter-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EXPORTER')
  @HttpCode(HttpStatus.OK)
  async exporterOnly(@Request() req) {
    return {
      message: 'This is only accessible by EXPORTER role',
      user: req.user,
    };
  }

  @Get('landowner-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDOWNER')
  @HttpCode(HttpStatus.OK)
  async landownerOnly(@Request() req) {
    return {
      message: 'This is only accessible by LANDOWNER role',
      user: req.user,
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async adminOnly(@Request() req) {
    return {
      message: 'This is only accessible by ADMIN role',
      user: req.user,
    };
  }

  @Get('exporter-and-landowner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EXPORTER', 'LANDOWNER')
  @HttpCode(HttpStatus.OK)
  async exporterAndLandowner(@Request() req) {
    return {
      message: 'This is accessible by EXPORTER and LANDOWNER roles',
      user: req.user,
    };
  }
}
