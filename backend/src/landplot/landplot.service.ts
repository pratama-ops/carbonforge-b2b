import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLandplotDto } from './dto/create-landplot.dto';

@Injectable()
export class LandplotService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateLandplotDto) {
    return this.prisma.landPlot.create({
      data: {
        landownerId: userId,
        plotName: dto.plotName,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        areaHa: dto.areaSize,
        vegetationType: dto.vegetationType,
        estimatedCarbonCredits: dto.estimatedCarbonCredits,
        carbonCapacity: dto.carbonCapacity,
        documentUrl: dto.documentUrl,
        ndviScore: dto.ndviScore,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.landPlot.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const landPlot = await this.prisma.landPlot.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!landPlot) {
      throw new NotFoundException(`Land plot with ID "${id}" not found`);
    }

    return landPlot;
  }
}
