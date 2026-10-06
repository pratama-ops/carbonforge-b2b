import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchmakingQueryDto } from './dto/matchmaking-query.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { RetireCertificateDto } from './dto/retire-certificate.dto';
import {
  LandPlotStatus,
  TransactionStatus,
  CertificateStatus,
  MatchStatus,
} from '../generated/prisma/client';

@Injectable()
export class CorporateService {
  constructor(private prisma: PrismaService) {}

  async getMatchmaking(buyerId: string, query: MatchmakingQueryDto) {
    const where: any = {
      status: LandPlotStatus.VERIFIED,
    };

    if (query.vegetationType) {
      where.vegetationType = query.vegetationType;
    }
    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }
    if (query.minAreaHa !== undefined) {
      where.areaHa = { ...where.areaHa, gte: query.minAreaHa };
    }
    if (query.maxAreaHa !== undefined) {
      where.areaHa = { ...where.areaHa, lte: query.maxAreaHa };
    }

    const lands = await this.prisma.landPlot.findMany({
      where,
      include: {
        owner: {
          select: { name: true },
        },
      },
      take: query.limit,
      skip: query.offset,
    });

    // Calculate match score for each land
    const recommendations = lands.map((land) => {
      let matchScore = 50; // Base score

      // Vegetation type match
      if (query.vegetationType && land.vegetationType === query.vegetationType) {
        matchScore += 20;
      }

      // Area match
      if (query.targetCarbonTon) {
        const carbonRatio = Math.min(land.estimatedCarbonCredits / query.targetCarbonTon, 1);
        matchScore += carbonRatio * 20;
      }

      // NDVI score bonus
      if (land.ndviScore) {
        matchScore += land.ndviScore * 10;
      }

      matchScore = Math.min(Math.round(matchScore), 100);

      // Calculate sustainability rating (1-5)
      const sustainabilityRating = Math.min(
        Math.max(Math.ceil(matchScore / 20), 1),
        5,
      );

      // Estimate price per credit (simplified)
      const pricePerCredit = Math.round(15 + (100 - matchScore) * 0.1);

      return {
        id: land.id,
        plotName: land.plotName,
        location: land.location,
        vegetationType: land.vegetationType,
        areaHa: land.areaHa,
        estimatedCarbonCredits: land.estimatedCarbonCredits,
        sustainabilityRating,
        pricePerCredit,
        landownerName: land.owner.name,
        matchScore,
        ndviScore: land.ndviScore,
      };
    });

    // Filter by min match score
    let filtered = recommendations;
    if (query.minMatchScore !== undefined) {
      filtered = recommendations.filter((r) => r.matchScore >= (query.minMatchScore ?? 0));
    }

    // Sort by match score descending
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    return {
      recommendations: filtered,
      total: filtered.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async purchase(buyerId: string, dto: PurchaseDto) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id: dto.landPlotId },
    });
    if (!landPlot) throw new NotFoundException('Land plot not found');
    if (landPlot.status !== LandPlotStatus.VERIFIED) {
      throw new BadRequestException('Land plot is not verified');
    }

    const totalAmount = dto.volumeTonCO2e * dto.pricePerTon;

    // Get platform settings for fee calculation
    const settings = await this.prisma.platformSetting.findUnique({
      where: { key: 'platform' },
    });
    const platformFeePercent = (settings?.value as any)?.platformFeePercent ?? 2.5;
    const platformFee = (totalAmount * platformFeePercent) / 100;
    const netAmount = totalAmount - platformFee;

    // Create matchmaking record
    const match = await this.prisma.matchmaking.create({
      data: {
        landPlotId: dto.landPlotId,
        buyerId: buyerId,
        matchedScore: 100,
        status: MatchStatus.ACCEPTED,
      },
    });

    // Create transaction with escrow
    const transaction = await this.prisma.transaction.create({
      data: {
        matchId: match.id,
        buyerId: buyerId,
        sellerId: landPlot.landownerId,
        landPlotId: dto.landPlotId,
        volumeTonCO2e: dto.volumeTonCO2e,
        pricePerTon: dto.pricePerTon,
        totalAmount: totalAmount,
        platformFee: platformFee,
        netAmount: netAmount,
        status: TransactionStatus.IN_ESCROW,
      },
    });

    return {
      transaction: {
        id: transaction.id,
        plotName: landPlot.plotName,
        volumeTonCO2e: transaction.volumeTonCO2e,
        pricePerTon: transaction.pricePerTon,
        totalAmount: transaction.totalAmount,
        platformFee: transaction.platformFee,
        netAmount: transaction.netAmount,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
      message: 'Purchase initiated. Transaction is in escrow.',
    };
  }

  async getPortfolio(buyerId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        buyerId: buyerId,
        status: TransactionStatus.COMPLETED,
      },
      include: {
        landPlot: {
          select: { plotName: true, vegetationType: true },
        },
        certificate: true,
      },
    });

    const totalCarbonOffsetTon = transactions.reduce(
      (sum, t) => sum + t.volumeTonCO2e,
      0,
    );
    const totalCarbonInvestment = transactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0,
    );

    const certificates = transactions
      .filter((t) => t.certificate)
      .map((t) => ({
        id: t.certificate!.id,
        certificateId: t.certificate!.certificateId,
        plotName: t.landPlot.plotName,
        volumeTonCO2e: t.certificate!.volumeTonCO2e,
        status: t.certificate!.status,
        issuedAt: t.certificate!.issuedAt,
        retiredAt: t.certificate!.retiredAt,
      }));

    const activeCertificates = certificates.filter((c) => c.status === CertificateStatus.ACTIVE);
    const retiredCertificates = certificates.filter((c) => c.status === CertificateStatus.RETIRED);

    return {
      totalCarbonOffsetTon,
      totalCarbonInvestment,
      completedTransactions: transactions.length,
      activeCertificates: activeCertificates.length,
      retiredCertificates: retiredCertificates.length,
      certificates,
    };
  }

  async getTransactions(buyerId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { buyerId: buyerId },
      include: {
        landPlot: {
          select: { plotName: true },
        },
        seller: {
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
      landownerName: t.seller.name,
      volumeTonCO2e: t.volumeTonCO2e,
      pricePerTon: t.pricePerTon,
      totalAmount: t.totalAmount,
      platformFee: t.platformFee,
      status: t.status,
      transactionDate: t.createdAt,
      escrowReleasedAt: t.escrowReleasedAt,
      certificateId: t.certificate?.certificateId ?? null,
    }));
  }

  async getCertificates(buyerId: string) {
    const certificates = await this.prisma.carbonCertificate.findMany({
      where: { buyerId: buyerId },
      include: {
        landPlot: {
          select: { plotName: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certificates.map((c) => ({
      id: c.id,
      certificateId: c.certificateId,
      plotName: c.landPlot.plotName,
      volumeTonCO2e: c.volumeTonCO2e,
      status: c.status,
      issuedAt: c.issuedAt,
      retiredAt: c.retiredAt,
      retirementReason: c.retirementReason,
    }));
  }

  async retireCertificate(
    buyerId: string,
    certificateId: string,
    dto: RetireCertificateDto,
  ) {
    const certificate = await this.prisma.carbonCertificate.findFirst({
      where: { id: certificateId, buyerId: buyerId },
    });
    if (!certificate) throw new NotFoundException('Certificate not found');
    if (certificate.status === CertificateStatus.RETIRED) {
      throw new BadRequestException('Certificate is already retired');
    }

    const updated = await this.prisma.carbonCertificate.update({
      where: { id: certificateId },
      data: {
        status: CertificateStatus.RETIRED,
        retiredAt: new Date(),
        retirementReason: dto.retirementReason,
      },
    });

    return {
      message: 'Certificate retired successfully',
      certificate: updated,
    };
  }
}
