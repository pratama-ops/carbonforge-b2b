import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingRequestDto } from './matchmaking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EXPORTER')
  async findMatches(@Body() dto: MatchmakingRequestDto, @Request() req) {
    return this.matchmakingService.findMatches(req.user.id, dto);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EXPORTER')
  async getRecommendations(@Request() req) {
    return this.matchmakingService.getRecommendations(req.user.id);
  }
}
