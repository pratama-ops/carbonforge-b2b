import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { LogLevel, LogCategory } from '../../generated/prisma/client';

export class LogsQueryDto {
  @IsOptional()
  @IsEnum(LogLevel)
  level?: LogLevel;

  @IsOptional()
  @IsEnum(LogCategory)
  category?: LogCategory;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
