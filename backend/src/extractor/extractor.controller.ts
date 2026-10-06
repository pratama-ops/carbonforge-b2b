import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractorService } from './extractor.service';
import { ExtractDocumentDto } from './dto/extract-document.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../generated/prisma/client';

@Controller('api/landowner/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LANDOWNER)
export class ExtractorController {
  constructor(private readonly extractorService: ExtractorService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractDocument(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ExtractDocumentDto,
  ) {
    return this.extractorService.extractDocument(user.id, file, dto);
  }

  @Get()
  async getDocuments(@CurrentUser() user: AuthUser) {
    return this.extractorService.getDocuments(user.id);
  }

  @Get(':id')
  async getDocumentById(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.extractorService.getDocumentById(user.id, id);
  }
}
