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

export class CreateLandPlotDto {
  @IsString()
  plotName: string;

  @IsString()
  location: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsNumber()
  @Min(0.01)
  areaHa: number;

  @IsEnum(VegetationType)
  vegetationType: VegetationType;

  @IsNumber()
  @Min(0)
  estimatedCarbonCredits: number;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  ndviScore?: number;
}
