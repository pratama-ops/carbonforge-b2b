import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LandownerModule } from './landowner/landowner.module';
import { CorporateModule } from './corporate/corporate.module';
import { AdminModule } from './admin/admin.module';
import { ExtractorModule } from './extractor/extractor.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { TransactionModule } from './transaction/transaction.module';
import { CertificateModule } from './certificate/certificate.module';
import { LogsModule } from './logs/logs.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    LandownerModule,
    CorporateModule,
    AdminModule,
    ExtractorModule,
    MatchmakingModule,
    TransactionModule,
    CertificateModule,
    LogsModule,
    SettingsModule,
  ],
})
export class AppModule {}
