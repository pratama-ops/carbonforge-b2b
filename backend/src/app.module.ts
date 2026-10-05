import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LandplotModule } from './landplot/landplot.module';
import { TransactionModule } from './transaction/transaction.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { ExtractorModule } from './extractor/extractor.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, LandplotModule, TransactionModule, MatchmakingModule, ExtractorModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
