import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtractorService } from './extractor.service';
import { ExtractorController } from './extractor.controller';
import { GroqService } from './groq.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [ExtractorController],
  providers: [ExtractorService, GroqService],
})
export class ExtractorModule {}
