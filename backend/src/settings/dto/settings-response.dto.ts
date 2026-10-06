export class SettingsResponseDto {
  platformName: string;
  supportEmail: string;
  maxLandAreaHa: number;
  verificationRequired: boolean;
  autoApproveThreshold: number;
  maintenanceMode: boolean;
  notificationEmail: boolean;
  notificationSms: boolean;
  platformFeePercent: number;
  fixedTransactionFee: number;
  minimumTransactionAmount: number;
  maximumTransactionAmount: number;
  aiConfidenceThreshold: number;
  documentToleranceDays: number;
  maxDocumentsPerLand: number;
  aiAutoExtraction: boolean;
  groqApiKey: string;
  webhookUrl: string;
  blockchainRegistryAddress: string;
  apiRateLimit: number;
  webhookRetryAttempts: number;
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  ipWhitelistEnabled: boolean;
  whitelistedIps: string[];
}
