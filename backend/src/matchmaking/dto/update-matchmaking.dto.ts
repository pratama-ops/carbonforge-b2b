import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { MatchStatus } from '../../generated/prisma/client';

export class UpdateMatchmakingDto {
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  matchedScore?: number;
}
