import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { TransactionStatus } from '../../generated/prisma/client';

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  @IsDateString()
  escrowReleasedAt?: string;
}
