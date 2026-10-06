import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  platformName?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  platformFeePercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedTransactionFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumTransactionAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumTransactionAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aiConfidenceThreshold?: number;

  @IsOptional()
  @IsBoolean()
  verificationRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  autoApproveThreshold?: number;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationSms?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDocumentsPerLand?: number;

  @IsOptional()
  @IsBoolean()
  aiAutoExtraction?: boolean;

  @IsOptional()
  @IsString()
  groqApiKey?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsString()
  blockchainRegistryAddress?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  apiRateLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  webhookRetryAttempts?: number;

  @IsOptional()
  @IsBoolean()
  twoFactorRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sessionTimeoutMinutes?: number;

  @IsOptional()
  @IsBoolean()
  ipWhitelistEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whitelistedIps?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLandAreaHa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  documentToleranceDays?: number;
}
