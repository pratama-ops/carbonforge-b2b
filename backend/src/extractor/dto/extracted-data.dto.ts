import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GpsCoordinatesDto {
  @IsString()
  lat: string;

  @IsString()
  lng: string;
}

export class ExtractedDataDto {
  @IsString()
  certificateNumber: string;

  @IsString()
  ownerName: string;

  @ValidateNested()
  @Type(() => GpsCoordinatesDto)
  gpsCoordinates: GpsCoordinatesDto;

  @IsString()
  areaHectares: string;

  @IsString()
  estimatedCarbonPotential: string;

  @IsOptional()
  @IsNumber()
  confidence?: number;

  @IsOptional()
  @IsString()
  vegetationType?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
