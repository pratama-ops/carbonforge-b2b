import { Module } from '@nestjs/common';
import { LandplotService } from './landplot.service';
import { LandplotController } from './landplot.controller';

@Module({
  controllers: [LandplotController],
  providers: [LandplotService],
})
export class LandplotModule {}
