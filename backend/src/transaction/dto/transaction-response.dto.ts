import { TransactionStatus } from '../../generated/prisma/client';

export class TransactionResponseDto {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  landPlotId: string;
  plotName: string;
  volumeTonCO2e: number;
  pricePerTon: number;
  totalAmount: number;
  platformFee: number;
  netAmount: number;
  status: TransactionStatus;
  escrowReleasedAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  certificateId: string | null;
}
