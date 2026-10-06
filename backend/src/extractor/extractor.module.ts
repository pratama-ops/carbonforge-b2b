import { Module } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ExtractorController } from './extractor.controller';
import { GroqService } from './groq.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExtractorController],
  providers: [ExtractorService, GroqService],
  exports: [ExtractorService, GroqService],
})
export class ExtractorModule {}
