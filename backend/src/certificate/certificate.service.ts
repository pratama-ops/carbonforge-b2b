import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RetireCertificateDto } from './dto/retire.dto';
import { CertificateStatus } from '../generated/prisma/client';

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  async findByBuyer(buyerId: string) {
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

  async retire(certificateId: string, buyerId: string, dto: RetireCertificateDto) {
    const certificate = await this.prisma.carbonCertificate.findFirst({
      where: { id: certificateId, buyerId: buyerId },
    });
    if (!certificate) throw new NotFoundException('Certificate not found');

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
