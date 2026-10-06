import { Module } from '@nestjs/common';
import { LandownerService } from './landowner.service';
import { LandownerController } from './landowner.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandownerController],
  providers: [LandownerService],
  exports: [LandownerService],
})
export class LandownerModule {}
