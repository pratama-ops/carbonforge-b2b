import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TransactionStatus } from '../../generated/prisma/client';

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  landPlotId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
