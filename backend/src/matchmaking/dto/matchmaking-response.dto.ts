import { MatchStatus, VegetationType } from '../../generated/prisma/client';

export class MatchmakingResponseDto {
  id: string;
  landPlotId: string;
  plotName: string;
  location: string;
  vegetationType: VegetationType;
  areaHa: number;
  estimatedCarbonCredits: number;
  sustainabilityRating: number;
  pricePerCredit: number;
  landownerName: string;
  matchScore: number;
  status: MatchStatus;
  createdAt: Date;
}
