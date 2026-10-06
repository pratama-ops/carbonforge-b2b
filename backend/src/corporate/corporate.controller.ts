import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { MatchmakingQueryDto } from './dto/matchmaking-query.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { RetireCertificateDto } from './dto/retire-certificate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../generated/prisma/client';

@Controller('api/corporate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CORPORATE_BUYER)
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Get('matchmaking')
  async getMatchmaking(
    @CurrentUser() user: AuthUser,
    @Query() query: MatchmakingQueryDto,
  ) {
    return this.corporateService.getMatchmaking(user.id, query);
  }

  @Post('purchase')
  async purchase(
    @CurrentUser() user: AuthUser,
    @Body() dto: PurchaseDto,
  ) {
    return this.corporateService.purchase(user.id, dto);
  }

  @Get('portfolio')
  async getPortfolio(@CurrentUser() user: AuthUser) {
    return this.corporateService.getPortfolio(user.id);
  }

  @Get('transactions')
  async getTransactions(@CurrentUser() user: AuthUser) {
    return this.corporateService.getTransactions(user.id);
  }

  @Get('certificates')
  async getCertificates(@CurrentUser() user: AuthUser) {
    return this.corporateService.getCertificates(user.id);
  }

  @Post('certificates/:id/retire')
  async retireCertificate(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RetireCertificateDto,
  ) {
    return this.corporateService.retireCertificate(user.id, id, dto);
  }
}
