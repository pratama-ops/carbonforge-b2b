import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateLandplotDto {
  @IsString({ message: 'Plot name must be a string' })
  @IsNotEmpty({ message: 'Plot name is required' })
  plotName: string;

  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsNumber({}, { message: 'Area size must be a number' })
  @IsNotEmpty({ message: 'Area size is required' })
  @Min(0, { message: 'Area size must be at least 0' })
  areaSize: number;

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
