import { DocStatus } from '../../generated/prisma/client';

export class DocumentResponseDto {
  id: string;
  fileUrl: string;
  fileType: string;
  fileSize: number | null;
  status: DocStatus;
  extractedData: any;
  aiConfidence: number | null;
  cbamScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}
