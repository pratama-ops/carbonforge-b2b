import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLandPlotDto } from './dto/create-landplot.dto';
import { UpdateLandPlotDto } from './dto/update-landplot.dto';
import { LandPlotStatus, TransactionStatus } from '../generated/prisma/client';

@Injectable()
export class LandownerService {
  constructor(private prisma: PrismaService) {}

  async createLand(ownerId: string, dto: CreateLandPlotDto) {
    const landPlot = await this.prisma.landPlot.create({
      data: {
        landownerId: ownerId,
        plotName: dto.plotName,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        areaHa: dto.areaHa,
        vegetationType: dto.vegetationType,
        estimatedCarbonCredits: dto.estimatedCarbonCredits,
        carbonCapacity: dto.estimatedCarbonCredits,
        documentUrl: dto.documentUrl,
        ndviScore: dto.ndviScore,
        status: LandPlotStatus.PENDING,
      },
    });

    return {
      ...landPlot,
      documentsCount: 0,
    };
  }

  async getLands(ownerId: string) {
    const lands = await this.prisma.landPlot.findMany({
      where: { landownerId: ownerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    return lands.map((land) => ({
      id: land.id,
      plotName: land.plotName,
      location: land.location,
      latitude: land.latitude,
      longitude: land.longitude,
      areaHa: land.areaHa,
      vegetationType: land.vegetationType,
      estimatedCarbonCredits: land.estimatedCarbonCredits,
      carbonCapacity: land.carbonCapacity,
      status: land.status,
      ndviScore: land.ndviScore,
      rejectionReason: land.rejectionReason,
      verifiedAt: land.verifiedAt,
      createdAt: land.createdAt,
      updatedAt: land.updatedAt,
      documentsCount: land._count.documents,
    }));
  }

  async getLandById(ownerId: string, landId: string) {
    const land = await this.prisma.landPlot.findFirst({
      where: { id: landId, landownerId: ownerId },
      include: {
        documents: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            status: true,
            aiConfidence: true,
            createdAt: true,
          },
        },
      },
    });

    if (!land) throw new NotFoundException('Land plot not found');

    return {
      id: land.id,
      plotName: land.plotName,
      location: land.location,
      latitude: land.latitude,
      longitude: land.longitude,
      areaHa: land.areaHa,
      vegetationType: land.vegetationType,
      estimatedCarbonCredits: land.estimatedCarbonCredits,
      carbonCapacity: land.carbonCapacity,
      status: land.status,
      ndviScore: land.ndviScore,
      rejectionReason: land.rejectionReason,
      verifiedAt: land.verifiedAt,
      createdAt: land.createdAt,
      updatedAt: land.updatedAt,
      documents: land.documents,
    };
  }

  async updateLand(ownerId: string, landId: string, dto: UpdateLandPlotDto) {
    const land = await this.prisma.landPlot.findFirst({
      where: { id: landId, landownerId: ownerId },
    });
    if (!land) throw new NotFoundException('Land plot not found');

    if (land.status === LandPlotStatus.VERIFIED) {
      throw new BadRequestException('Cannot update verified land plot');
    }

    const updated = await this.prisma.landPlot.update({
      where: { id: landId },
      data: {
        plotName: dto.plotName,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        areaHa: dto.areaHa,
        vegetationType: dto.vegetationType,
        estimatedCarbonCredits: dto.estimatedCarbonCredits,
        carbonCapacity: dto.estimatedCarbonCredits,
        documentUrl: dto.documentUrl,
        ndviScore: dto.ndviScore,
      },
    });

    return updated;
  }

  async deleteLand(ownerId: string, landId: string) {
    const land = await this.prisma.landPlot.findFirst({
      where: { id: landId, landownerId: ownerId },
    });
    if (!land) throw new NotFoundException('Land plot not found');

    if (land.status !== LandPlotStatus.PENDING) {
      throw new BadRequestException('Can only delete pending land plots');
    }

    await this.prisma.landPlot.delete({ where: { id: landId } });
    return { message: 'Land plot deleted successfully' };
  }

  async getPortfolio(ownerId: string) {
    const lands = await this.prisma.landPlot.findMany({
      where: { landownerId: ownerId },
    });

    const verifiedLands = lands.filter((l) => l.status === LandPlotStatus.VERIFIED);
    const pendingLands = lands.filter((l) => l.status === LandPlotStatus.PENDING);
    const rejectedLands = lands.filter((l) => l.status === LandPlotStatus.REJECTED);

    const totalLandAreaHa = verifiedLands.reduce((sum, l) => sum + l.areaHa, 0);
    const totalEstimatedCarbonCredits = verifiedLands.reduce(
      (sum, l) => sum + l.estimatedCarbonCredits,
      0,
    );

    const transactions = await this.prisma.transaction.findMany({
      where: { sellerId: ownerId },
    });

    const completedTransactions = transactions.filter(
      (t) => t.status === TransactionStatus.COMPLETED,
    );
    const totalCreditsSold = completedTransactions.reduce(
      (sum, t) => sum + t.volumeTonCO2e,
      0,
    );
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.netAmount, 0);

    return {
      totalLandAreaHa,
      totalEstimatedCarbonCredits,
      verifiedCount: verifiedLands.length,
      pendingCount: pendingLands.length,
      rejectedCount: rejectedLands.length,
      totalPlots: lands.length,
      totalCreditsSold,
      totalRevenue,
      activeCarbonTon: totalEstimatedCarbonCredits - totalCreditsSold,
    };
  }

  async getTransactions(ownerId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { sellerId: ownerId },
      include: {
        landPlot: {
          select: { plotName: true },
        },
        buyer: {
          select: { name: true },
        },
        certificate: {
          select: { certificateId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t) => ({
      id: t.id,
      plotName: t.landPlot.plotName,
      buyerName: t.buyer.name,
      volumeTonCO2e: t.volumeTonCO2e,
      pricePerTon: t.pricePerTon,
      totalAmount: t.totalAmount,
      platformFee: t.platformFee,
      netAmount: t.netAmount,
      status: t.status,
      transactionDate: t.createdAt,
      escrowReleasedAt: t.escrowReleasedAt,
      certificateId: t.certificate?.certificateId ?? null,
    }));
  }
}
