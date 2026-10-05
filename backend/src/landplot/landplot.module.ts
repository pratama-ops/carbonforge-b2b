import { Module } from '@nestjs/common';
import { LandplotService } from './landplot.service';
import { LandplotController } from './landplot.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LandplotController],
  providers: [LandplotService],
})
export class LandplotModule {}
