import { VegetationType } from '../../generated/prisma/client';

export class MatchmakingResponseDto {
  id: string;
  plotName: string;
  location: string;
  vegetationType: VegetationType;
  areaHa: number;
  estimatedCarbonCredits: number;
  sustainabilityRating: number;
  pricePerCredit: number;
  landownerName: string;
  matchScore: number;
  ndviScore: number | null;
}
