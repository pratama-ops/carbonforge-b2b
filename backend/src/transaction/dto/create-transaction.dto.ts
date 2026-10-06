import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @IsUUID()
  buyerId: string;

  @IsUUID()
  sellerId: string;

  @IsUUID()
  landPlotId: string;

  @IsNumber()
  @Min(0.01)
  volumeTonCO2e: number;

  @IsNumber()
  @Min(0)
  pricePerTon: number;
}
