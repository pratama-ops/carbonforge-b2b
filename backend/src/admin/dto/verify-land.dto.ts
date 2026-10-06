import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class VerifyLandDto {
  @IsIn(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  @MinLength(5)
  rejectionReason?: string;
}
