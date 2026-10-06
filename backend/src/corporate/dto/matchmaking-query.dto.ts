import { IsOptional, IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { VegetationType } from '../../generated/prisma/client';

export class MatchmakingQueryDto {
  @IsOptional()
  @IsEnum(VegetationType)
  vegetationType?: VegetationType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAreaHa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAreaHa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  targetCarbonTon?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minMatchScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
