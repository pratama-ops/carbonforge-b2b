import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { VegetationType } from '../../generated/prisma/client';

export class UpdateLandPlotDto {
  @IsOptional()
  @IsString()
  plotName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  areaHa?: number;

  @IsOptional()
  @IsEnum(VegetationType)
  vegetationType?: VegetationType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCarbonCredits?: number;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  ndviScore?: number;
}
