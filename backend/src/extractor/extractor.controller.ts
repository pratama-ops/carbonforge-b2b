import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { DocumentExtractorDto } from './dto/document-extractor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
export class ExtractorController {
  constructor(private readonly extractorService: ExtractorService) {}

  @Post('extract')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async extract(@Body() dto: DocumentExtractorDto) {
    const extractedData = await this.extractorService.extractDocumentData(
      dto.content,
    );

    return {
      success: true,
      data: extractedData,
    };
  }
}
