import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchmakingDto } from './dto/create-matchmaking.dto';
import { UpdateMatchmakingDto } from './dto/update-matchmaking.dto';
import { MatchmakingQueryDto } from './dto/matchmaking-query.dto';
import { MatchStatus, LandPlotStatus } from '../generated/prisma/client';

@Injectable()
export class MatchmakingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMatchmakingDto) {
    const match = await this.prisma.matchmaking.create({
      data: {
        documentId: dto.documentId,
        landPlotId: dto.landPlotId,
        buyerId: dto.buyerId,
        matchedScore: dto.matchedScore,
        filterCriteria: dto.filterCriteria,
      },
    });
    return match;
  }

  async update(id: string, dto: UpdateMatchmakingDto) {
    const match = await this.prisma.matchmaking.update({
      where: { id },
      data: {
        status: dto.status,
        matchedScore: dto.matchedScore,
      },
    });
    return match;
  }

  async findByBuyer(buyerId: string, query: MatchmakingQueryDto) {
    const where: any = {
      buyerId: buyerId,
    };

    if (query.landPlotId) {
      where.landPlotId = query.landPlotId;
    }

    const matches = await this.prisma.matchmaking.findMany({
      where,
      include: {
        landPlot: {
          include: {
            owner: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    });

    return matches.map((m) => ({
      id: m.id,
      landPlotId: m.landPlotId,
      plotName: m.landPlot.plotName,
      location: m.landPlot.location,
      vegetationType: m.landPlot.vegetationType,
      areaHa: m.landPlot.areaHa,
      estimatedCarbonCredits: m.landPlot.estimatedCarbonCredits,
      sustainabilityRating: Math.min(Math.ceil(m.matchedScore / 20), 5),
      pricePerCredit: Math.round(15 + (100 - m.matchedScore) * 0.1),
      landownerName: m.landPlot.owner.name,
      matchScore: m.matchedScore,
      status: m.status,
      createdAt: m.createdAt,
    }));
  }

  async findMatches(buyerId: string, dto: any) {
    return this.findByBuyer(buyerId, {
      landPlotId: dto.landPlotId,
      limit: dto.limit || 10,
      offset: dto.offset || 0,
    });
  }

  async getRecommendations(buyerId: string) {
    return this.findByBuyer(buyerId, {
      limit: 10,
      offset: 0,
    });
  }
}
