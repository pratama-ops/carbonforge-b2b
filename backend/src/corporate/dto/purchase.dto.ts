import { IsUUID, IsNumber, Min } from 'class-validator';

export class PurchaseDto {
  @IsUUID()
  landPlotId: string;

  @IsNumber()
  @Min(0.01)
  volumeTonCO2e: number;

  @IsNumber()
  @Min(0)
  pricePerTon: number;
}
