import { CertificateStatus } from '../../generated/prisma/client';

export class CertificateResponseDto {
  id: string;
  certificateId: string;
  transactionId: string;
  landPlotId: string;
  plotName: string;
  buyerId: string;
  volumeTonCO2e: number;
  status: CertificateStatus;
  issuedAt: Date;
  retiredAt: Date | null;
  retirementReason: string | null;
}
