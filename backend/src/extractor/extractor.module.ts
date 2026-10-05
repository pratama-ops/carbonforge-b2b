import { Module } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ExtractorController } from './extractor.controller';

@Module({
  controllers: [ExtractorController],
  providers: [ExtractorService],
})
export class ExtractorModule {}
