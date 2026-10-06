import { IsUUID, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateMatchmakingDto {
  @IsUUID()
  landPlotId: string;

  @IsUUID()
  buyerId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  matchedScore: number;

  @IsOptional()
  @IsUUID()
  documentId?: string;

  @IsOptional()
  filterCriteria?: Record<string, any>;
}
