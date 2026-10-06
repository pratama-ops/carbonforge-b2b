import { LandPlotStatus, VegetationType } from '../../generated/prisma/client';

export class LandPlotResponseDto {
  id: string;
  plotName: string;
  location: string;
  latitude: number;
  longitude: number;
  areaHa: number;
  vegetationType: VegetationType;
  estimatedCarbonCredits: number;
  carbonCapacity: number;
  status: LandPlotStatus;
  ndviScore: number | null;
  rejectionReason: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  documentsCount: number;
}
