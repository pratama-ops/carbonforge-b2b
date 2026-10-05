import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyLandPlotDto } from './dto/admin.dto';
import { UserRole, LandPlotStatus } from '../generated/prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        companyName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPendingLandPlots() {
    return this.prisma.landPlot.findMany({
      where: {
        status: LandPlotStatus.PENDING,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            companyName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async verifyLandPlot(id: string, dto: VerifyLandPlotDto) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
    });

    if (!landPlot) {
      throw new NotFoundException(`Land plot with ID "${id}" not found`);
    }

    if (landPlot.status !== LandPlotStatus.PENDING) {
      throw new NotFoundException(
        `Land plot with ID "${id}" has already been processed`,
      );
    }

    return this.prisma.landPlot.update({
      where: { id },
      data: {
        status: dto.status,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            companyName: true,
            role: true,
          },
        },
      },
    });
  }
}
