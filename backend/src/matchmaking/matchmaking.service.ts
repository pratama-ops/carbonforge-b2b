import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchmakingRequestDto } from './matchmaking.dto';

@Injectable()
export class MatchmakingService {
  constructor(private readonly prisma: PrismaService) {}

  async findMatches(exporterId: string, dto: MatchmakingRequestDto) {
    // Find the latest verified carbon document for the exporter
    const document = await this.prisma.carbonDocument.findFirst({
      where: { userId: exporterId, status: 'VERIFIED' },
      orderBy: { createdAt: 'desc' },
    });

    if (!document) {
      throw new BadRequestException(
        'No verified carbon document found. Please upload and verify a CBAM document first.',
      );
    }

    // Build query for verified land plots
    const where: any = { status: 'VERIFIED' };
    if (dto.preferredLocation) {
      where.location = { contains: dto.preferredLocation, mode: 'insensitive' };
    }

    const landPlots = await this.prisma.landPlot.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    // Score and rank land plots
    const scoredPlots = landPlots.map((plot) => ({
      ...plot,
      matchScore: this.calculateScore(plot, dto.requiredCarbonAmount),
    }));

    scoredPlots.sort((a, b) => b.matchScore - a.matchScore);

    // Persist matchmaking records
    const matchmakingRecords = await Promise.all(
      scoredPlots.map((plot) =>
        this.prisma.matchmaking.create({
          data: {
            documentId: document.id,
            landPlotId: plot.id,
            matchedScore: plot.matchScore,
            status: 'SUGGESTED',
          },
        }),
      ),
    );

    return scoredPlots.map((plot, index) => ({
      matchId: matchmakingRecords[index].id,
      landPlot: {
        id: plot.id,
        plotName: plot.plotName,
        location: plot.location,
        areaSize: plot.areaSize,
        carbonCapacity: plot.carbonCapacity,
        ndviScore: plot.ndviScore,
        owner: plot.owner,
      },
      matchScore: plot.matchScore,
      status: 'SUGGESTED',
    }));
  }

  async getRecommendations(exporterId: string) {
    return this.prisma.matchmaking.findMany({
      where: {
        document: { userId: exporterId },
      },
      include: {
        landPlot: {
          select: {
            id: true,
            plotName: true,
            location: true,
            areaSize: true,
            carbonCapacity: true,
            ndviScore: true,
            owner: {
              select: {
                id: true,
                email: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { matchedScore: 'desc' },
    });
  }

  private calculateScore(
    landPlot: { carbonCapacity: number; areaSize: number; ndviScore: number | null },
    requiredCarbonAmount: number,
  ): number {
    // Capacity fit (50%): prefer plots that can absorb the required amount
    // without excessive oversupply (efficiency penalty)
    const capacityRatio = landPlot.carbonCapacity / requiredCarbonAmount;
    const capacityFit =
      capacityRatio >= 1
        ? 1 - Math.min((capacityRatio - 1) * 0.1, 0.5)
        : capacityRatio;

    // Area score (20%): larger area is better, normalized to 1000 ha
    const areaScore = Math.min(landPlot.areaSize / 1000, 1);

    // NDVI score (30%): higher vegetation index is better (0-1 scale)
    const ndviScore = landPlot.ndviScore ?? 0;

    // Weighted sum (0-1 scale)
    return capacityFit * 0.5 + areaScore * 0.2 + ndviScore * 0.3;
  }
}
