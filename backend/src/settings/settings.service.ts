import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.platformSetting.findMany();

    const settingsMap: Record<string, any> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return {
      platformName: settingsMap.platform?.platformName ?? 'CarbonForge B2B',
      supportEmail: settingsMap.platform?.supportEmail ?? 'support@carbonforge.id',
      maxLandAreaHa: settingsMap.platform?.maxLandAreaHa ?? 10000,
      verificationRequired: settingsMap.platform?.verificationRequired ?? true,
      autoApproveThreshold: settingsMap.platform?.autoApproveThreshold ?? 80,
      maintenanceMode: settingsMap.platform?.maintenanceMode ?? false,
      notificationEmail: settingsMap.platform?.notificationEmail ?? true,
      notificationSms: settingsMap.platform?.notificationSms ?? false,
      platformFeePercent: settingsMap.platform?.platformFeePercent ?? 2.5,
      fixedTransactionFee: settingsMap.platform?.fixedTransactionFee ?? 0,
      minimumTransactionAmount: settingsMap.platform?.minimumTransactionAmount ?? 100,
      maximumTransactionAmount: settingsMap.platform?.maximumTransactionAmount ?? 1000000,
      aiConfidenceThreshold: settingsMap.platform?.aiConfidenceThreshold ?? 0.75,
      documentToleranceDays: settingsMap.platform?.documentToleranceDays ?? 30,
      maxDocumentsPerLand: settingsMap.platform?.maxDocumentsPerLand ?? 5,
      aiAutoExtraction: settingsMap.platform?.aiAutoExtraction ?? true,
      groqApiKey: settingsMap.platform?.groqApiKey ?? '',
      webhookUrl: settingsMap.platform?.webhookUrl ?? '',
      blockchainRegistryAddress: settingsMap.platform?.blockchainRegistryAddress ?? '',
      apiRateLimit: settingsMap.platform?.apiRateLimit ?? 100,
      webhookRetryAttempts: settingsMap.platform?.webhookRetryAttempts ?? 3,
      twoFactorRequired: settingsMap.platform?.twoFactorRequired ?? false,
      sessionTimeoutMinutes: settingsMap.platform?.sessionTimeoutMinutes ?? 60,
      ipWhitelistEnabled: settingsMap.platform?.ipWhitelistEnabled ?? false,
      whitelistedIps: settingsMap.platform?.whitelistedIps ?? [],
    };
  }

  async updateSettings(adminId: string, dto: UpdateSettingsDto) {
    const settingsValue: Record<string, any> = {};

    const fieldMappings: Record<string, string> = {
      platformName: 'platformName',
      supportEmail: 'supportEmail',
      maxLandAreaHa: 'maxLandAreaHa',
      verificationRequired: 'verificationRequired',
      autoApproveThreshold: 'autoApproveThreshold',
      maintenanceMode: 'maintenanceMode',
      notificationEmail: 'notificationEmail',
      notificationSms: 'notificationSms',
      platformFeePercent: 'platformFeePercent',
      fixedTransactionFee: 'fixedTransactionFee',
      minimumTransactionAmount: 'minimumTransactionAmount',
      maximumTransactionAmount: 'maximumTransactionAmount',
      aiConfidenceThreshold: 'aiConfidenceThreshold',
      documentToleranceDays: 'documentToleranceDays',
      maxDocumentsPerLand: 'maxDocumentsPerLand',
      aiAutoExtraction: 'aiAutoExtraction',
      groqApiKey: 'groqApiKey',
      webhookUrl: 'webhookUrl',
      blockchainRegistryAddress: 'blockchainRegistryAddress',
      apiRateLimit: 'apiRateLimit',
      webhookRetryAttempts: 'webhookRetryAttempts',
      twoFactorRequired: 'twoFactorRequired',
      sessionTimeoutMinutes: 'sessionTimeoutMinutes',
      ipWhitelistEnabled: 'ipWhitelistEnabled',
      whitelistedIps: 'whitelistedIps',
    };

    for (const [dtoField, settingsField] of Object.entries(fieldMappings)) {
      if ((dto as any)[dtoField] !== undefined) {
        settingsValue[settingsField] = (dto as any)[dtoField];
      }
    }

    await this.prisma.platformSetting.upsert({
      where: { key: 'platform' },
      update: {
        value: settingsValue,
        updatedBy: adminId,
      },
      create: {
        key: 'platform',
        value: settingsValue,
        description: 'Platform-wide settings',
        updatedBy: adminId,
      },
    });

    return { message: 'Settings updated successfully' };
  }
}
