import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { VegetationType } from '../../generated/prisma/client';

export class CreateLandplotDto {
  @IsString({ message: 'Plot name must be a string' })
  @IsNotEmpty({ message: 'Plot name is required' })
  plotName: string;

  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;

  @IsNumber({}, { message: 'Area size must be a number' })
  @IsNotEmpty({ message: 'Area size is required' })
  @Min(0, { message: 'Area size must be at least 0' })
  areaSize: number;

  @IsEnum(VegetationType, { message: 'Vegetation type is required' })
  vegetationType: VegetationType;

  @IsNumber({}, { message: 'Estimated carbon credits must be a number' })
  @Min(0, { message: 'Estimated carbon credits must be at least 0' })
  estimatedCarbonCredits: number;

  @IsNumber({}, { message: 'Carbon capacity must be a number' })
  @IsNotEmpty({ message: 'Carbon capacity is required' })
  @Min(0, { message: 'Carbon capacity must be at least 0' })
  carbonCapacity: number;

  @IsString({ message: 'Document URL must be a string' })
  @IsNotEmpty({ message: 'Document URL is required' })
  documentUrl: string;

  @IsNumber({}, { message: 'NDVI score must be a number' })
  @IsOptional()
  ndviScore?: number;
}
