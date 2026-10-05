import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Role } from '../auth/roles.decorator';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(exporterId: string, dto: CreateTransactionDto) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id: dto.landPlotId },
    });

    if (!landPlot) {
      throw new NotFoundException(`Land plot with ID "${dto.landPlotId}" not found`);
    }

    return this.prisma.transaction.create({
      data: {
        exporterId,
        landPlotId: dto.landPlotId,
        amount: dto.amount,
        totalPrice: dto.totalPrice,
        status: 'COMPLETED',
      },
    });
  }

  async findAllForUser(userId: string, role: Role) {
    if (role === 'EXPORTER') {
      return this.prisma.transaction.findMany({
        where: { exporterId: userId },
        include: {
          landPlot: {
            select: {
              id: true,
              plotName: true,
              location: true,
              areaSize: true,
              carbonCapacity: true,
            },
          },
          exporter: {
            select: {
              id: true,
              email: true,
              companyName: true,
            },
          },
        },
      });
    }

    if (role === 'LANDOWNER') {
      return this.prisma.transaction.findMany({
        where: {
          landPlot: {
            landownerId: userId,
          },
        },
        include: {
          landPlot: {
            select: {
              id: true,
              plotName: true,
              location: true,
              areaSize: true,
              carbonCapacity: true,
            },
          },
          exporter: {
            select: {
              id: true,
              email: true,
              companyName: true,
            },
          },
        },
      });
    }

    return this.prisma.transaction.findMany({
      include: {
        landPlot: {
          select: {
            id: true,
            plotName: true,
            location: true,
            areaSize: true,
            carbonCapacity: true,
          },
        },
        exporter: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        landPlot: {
          select: {
            id: true,
            plotName: true,
            location: true,
            areaSize: true,
            carbonCapacity: true,
          },
        },
        exporter: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }

    return transaction;
  }
}
