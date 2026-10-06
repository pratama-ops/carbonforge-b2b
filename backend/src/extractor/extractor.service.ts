import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GroqService } from './groq.service';
import { ExtractDocumentDto } from './dto/extract-document.dto';
import { DocStatus } from '../generated/prisma/client';

@Injectable()
export class ExtractorService {
  constructor(
    private prisma: PrismaService,
    private groqService: GroqService,
  ) {}

  async extractDocument(
    userId: string,
    file: Express.Multer.File,
    dto: ExtractDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and images are allowed.');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const fileType = file.mimetype === 'application/pdf' ? 'PDF' : 'IMAGE';
    const fileBase64 = file.buffer.toString('base64');

    // Create document record
    const document = await this.prisma.carbonDocument.create({
      data: {
        userId: userId,
        landPlotId: dto.landPlotId,
        fileUrl: `/uploads/${Date.now()}-${file.originalname}`,
        fileType: fileType,
        fileSize: file.size,
        status: DocStatus.PROCESSING,
      },
    });

    // Process with Groq AI
    const result = await this.groqService.extractLandData(fileBase64, fileType);

    // Update document with extracted data
    const updated = await this.prisma.carbonDocument.update({
      where: { id: document.id },
      data: {
        extractedData: result.extractedData,
        aiConfidence: result.confidence,
        status: DocStatus.VERIFIED,
      },
    });

    return {
      documentId: updated.id,
      status: updated.status,
      extractedData: result.extractedData,
      aiConfidence: result.confidence,
      processingTimeMs: result.processingTimeMs,
    };
  }

  async getDocuments(userId: string) {
    const documents = await this.prisma.carbonDocument.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      status: doc.status,
      extractedData: doc.extractedData,
      aiConfidence: doc.aiConfidence,
      cbamScore: doc.cbamScore,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async getDocumentById(userId: string, documentId: string) {
    const document = await this.prisma.carbonDocument.findFirst({
      where: { id: documentId, userId: userId },
    });
    if (!document) throw new NotFoundException('Document not found');

    return {
      id: document.id,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      fileSize: document.fileSize,
      status: document.status,
      extractedData: document.extractedData,
      aiConfidence: document.aiConfidence,
      cbamScore: document.cbamScore,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
