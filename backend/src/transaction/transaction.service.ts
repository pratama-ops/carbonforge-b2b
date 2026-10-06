import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionStatus, CertificateStatus } from '../generated/prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    const totalAmount = dto.volumeTonCO2e * dto.pricePerTon;

    // Get platform settings
    const settings = await this.prisma.platformSetting.findUnique({
      where: { key: 'platform' },
    });
    const platformFeePercent = (settings?.value as any)?.platformFeePercent ?? 2.5;
    const platformFee = (totalAmount * platformFeePercent) / 100;
    const netAmount = totalAmount - platformFee;

    const transaction = await this.prisma.transaction.create({
      data: {
        matchId: dto.matchId,
        buyerId: dto.buyerId,
        sellerId: dto.sellerId,
        landPlotId: dto.landPlotId,
        volumeTonCO2e: dto.volumeTonCO2e,
        pricePerTon: dto.pricePerTon,
        totalAmount: totalAmount,
        platformFee: platformFee,
        netAmount: netAmount,
        status: TransactionStatus.IN_ESCROW,
      },
    });

    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: dto.status,
        failureReason: dto.failureReason,
        escrowReleasedAt: dto.escrowReleasedAt
          ? new Date(dto.escrowReleasedAt)
          : undefined,
      },
    });

    // If completed, generate certificate
    if (dto.status === TransactionStatus.COMPLETED) {
      await this.generateCertificate(updated.id);
    }

    return updated;
  }

  async findByUser(query: TransactionQueryDto) {
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.userId) {
      where.OR = [
        { buyerId: query.userId },
        { sellerId: query.userId },
      ];
    }
    if (query.landPlotId) where.landPlotId = query.landPlotId;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        landPlot: {
          select: { plotName: true },
        },
        buyer: {
          select: { name: true },
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
      buyerName: t.buyer.name,
      sellerName: t.seller.name,
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

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        landPlot: {
          select: { plotName: true },
        },
        buyer: {
          select: { name: true },
        },
        seller: {
          select: { name: true },
        },
        certificate: {
          select: { certificateId: true },
        },
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return {
      id: transaction.id,
      plotName: transaction.landPlot.plotName,
      buyerName: transaction.buyer.name,
      sellerName: transaction.seller.name,
      volumeTonCO2e: transaction.volumeTonCO2e,
      pricePerTon: transaction.pricePerTon,
      totalAmount: transaction.totalAmount,
      platformFee: transaction.platformFee,
      netAmount: transaction.netAmount,
      status: transaction.status,
      transactionDate: transaction.createdAt,
      escrowReleasedAt: transaction.escrowReleasedAt,
      certificateId: transaction.certificate?.certificateId ?? null,
    };
  }

  private async generateCertificate(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        landPlot: true,
      },
    });

    if (!transaction) return;

    const certificateId = `CF-${new Date().getFullYear()}-${transaction.id.slice(0, 8).toUpperCase()}`;

    await this.prisma.carbonCertificate.create({
      data: {
        certificateId: certificateId,
        transactionId: transaction.id,
        landPlotId: transaction.landPlotId,
        buyerId: transaction.buyerId,
        volumeTonCO2e: transaction.volumeTonCO2e,
        status: CertificateStatus.ACTIVE,
      },
    });
  }
}
