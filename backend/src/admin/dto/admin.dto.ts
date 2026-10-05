import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { LandPlotStatus } from '../../generated/prisma/client';

export class VerifyLandPlotDto {
  @IsEnum(LandPlotStatus, {
    message: 'Status must be either VERIFIED or REJECTED',
  })
  status: LandPlotStatus;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
