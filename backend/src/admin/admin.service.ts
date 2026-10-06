import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyLandDto } from './dto/verify-land.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { LogsQueryDto } from './dto/logs-query.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { LandPlotStatus, UserStatus, UserRole } from '../generated/prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // LAND VERIFICATION
  // ============================================================

  async getPendingLands() {
    const lands = await this.prisma.landPlot.findMany({
      where: { status: LandPlotStatus.PENDING },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        documents: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            status: true,
            aiConfidence: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return lands.map((land) => ({
      id: land.id,
      plotName: land.plotName,
      landownerName: land.owner.name,
      landownerEmail: land.owner.email,
      location: land.location,
      latitude: land.latitude,
      longitude: land.longitude,
      areaHa: land.areaHa,
      vegetationType: land.vegetationType,
      estimatedCarbonCredits: land.estimatedCarbonCredits,
      status: land.status,
      submittedAt: land.createdAt,
      documentsCount: land.documents.length,
      documents: land.documents,
    }));
  }

  async getAllLands() {
    const lands = await this.prisma.landPlot.findMany({
      include: {
        owner: {
          select: { name: true, email: true },
        },
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return lands.map((land) => ({
      id: land.id,
      plotName: land.plotName,
      landownerName: land.owner.name,
      landownerEmail: land.owner.email,
      location: land.location,
      areaHa: land.areaHa,
      vegetationType: land.vegetationType,
      estimatedCarbonCredits: land.estimatedCarbonCredits,
      status: land.status,
      documentsCount: land._count.documents,
      createdAt: land.createdAt,
    }));
  }

  async verifyLand(landId: string, adminId: string, dto: VerifyLandDto) {
    const land = await this.prisma.landPlot.findUnique({
      where: { id: landId },
    });
    if (!land) throw new NotFoundException('Land plot not found');

    if (land.status !== LandPlotStatus.PENDING) {
      throw new BadRequestException('Land plot is not pending verification');
    }

    if (dto.action === 'REJECT' && !dto.rejectionReason) {
      throw new BadRequestException('Rejection reason is required');
    }

    const newStatus =
      dto.action === 'APPROVE'
        ? LandPlotStatus.VERIFIED
        : LandPlotStatus.REJECTED;

    const updated = await this.prisma.landPlot.update({
      where: { id: landId },
      data: {
        status: newStatus,
        rejectionReason: dto.action === 'REJECT' ? dto.rejectionReason : null,
        verifiedAt: dto.action === 'APPROVE' ? new Date() : null,
        verifiedBy: dto.action === 'APPROVE' ? adminId : null,
      },
    });

    // Log the action
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'VERIFICATION',
        message: `Land plot "${land.plotName}" ${dto.action === 'APPROVE' ? 'approved' : 'rejected'} by admin`,
        userId: adminId,
        metadata: { landPlotId: landId, action: dto.action },
      },
    });

    return {
      message: `Land plot ${dto.action === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
      land: updated,
    };
  }

  // ============================================================
  // USER MANAGEMENT
  // ============================================================

  async getUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.LANDOWNER, UserRole.CORPORATE_BUYER],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastActiveAt: true,
        _count: {
          select: {
            landPlots: true,
            transactionsAsBuyer: true,
            transactionsAsSeller: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      registeredAt: user.createdAt,
      lastActiveAt: user.lastActiveAt,
      totalTransactions:
        user._count.transactionsAsBuyer + user._count.transactionsAsSeller,
      totalLandPlots: user._count.landPlots,
    }));
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: dto.status,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return {
      message: 'User status updated successfully',
      user: updated,
    };
  }

  // ============================================================
  // TRANSACTION MONITORING
  // ============================================================

  async getTransactions() {
    const transactions = await this.prisma.transaction.findMany({
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
      landownerName: t.seller.name,
      buyerName: t.buyer.name,
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

  // ============================================================
  // SYSTEM LOGS
  // ============================================================

  async getLogs(query: LogsQueryDto) {
    const where: any = {};

    if (query.level) where.level = query.level;
    if (query.category) where.category = query.category;
    if (query.userId) where.userId = query.userId;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }
    if (query.search) {
      where.message = { contains: query.search, mode: 'insensitive' };
    }

    const logs = await this.prisma.systemLog.findMany({
      where,
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return logs.map((log) => ({
      id: log.id,
      level: log.level,
      category: log.category,
      message: log.message,
      userId: log.userId,
      userName: log.user?.name ?? null,
      metadata: log.metadata,
      createdAt: log.createdAt,
    }));
  }

  // ============================================================
  // PLATFORM SETTINGS
  // ============================================================

  async getSettings() {
    const settings = await this.prisma.platformSetting.findMany();

    const settingsMap: Record<string, any> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Return merged settings with defaults
    return {
      platformName: settingsMap.platform?.platformName ?? 'CarbonForge B2B',
      supportEmail: settingsMap.platform?.supportEmail ?? 'support@carbonforge.id',
      maxLandAreaHa: settingsMap.platform?.maxLandAreaHa ?? 10000,
      verificationRequired: settingsMap.platform?.verificationRequired ?? true,
      autoApproveThreshold: settingsMap.platform?.autoApproveThreshold ?? 80,
      maintenanceMode: settingsMap.platform?.maintenanceMode ?? false,
      notificationEmail: settingsMap.platform?.notificationEmail ?? true,
      notificationSms: settingsMap.platform?.notificationSms ?? false,
      platformFeePercent: settingsMap.platform?.platformFeePercent ?? 2.5,
      fixedTransactionFee: settingsMap.platform?.fixedTransactionFee ?? 0,
      minimumTransactionAmount: settingsMap.platform?.minimumTransactionAmount ?? 100,
      maximumTransactionAmount: settingsMap.platform?.maximumTransactionAmount ?? 1000000,
      aiConfidenceThreshold: settingsMap.platform?.aiConfidenceThreshold ?? 0.75,
      documentToleranceDays: settingsMap.platform?.documentToleranceDays ?? 30,
      maxDocumentsPerLand: settingsMap.platform?.maxDocumentsPerLand ?? 5,
      aiAutoExtraction: settingsMap.platform?.aiAutoExtraction ?? true,
      groqApiKey: settingsMap.platform?.groqApiKey ?? '',
      webhookUrl: settingsMap.platform?.webhookUrl ?? '',
      blockchainRegistryAddress: settingsMap.platform?.blockchainRegistryAddress ?? '',
      apiRateLimit: settingsMap.platform?.apiRateLimit ?? 100,
      webhookRetryAttempts: settingsMap.platform?.webhookRetryAttempts ?? 3,
      twoFactorRequired: settingsMap.platform?.twoFactorRequired ?? false,
      sessionTimeoutMinutes: settingsMap.platform?.sessionTimeoutMinutes ?? 60,
      ipWhitelistEnabled: settingsMap.platform?.ipWhitelistEnabled ?? false,
      whitelistedIps: settingsMap.platform?.whitelistedIps ?? [],
    };
  }

  async updateSettings(adminId: string, dto: UpdateSettingsDto) {
    const settingsValue: Record<string, any> = {};

    // Map DTO fields to settings object
    const fieldMappings: Record<string, string> = {
      platformName: 'platformName',
      supportEmail: 'supportEmail',
      maxLandAreaHa: 'maxLandAreaHa',
      verificationRequired: 'verificationRequired',
      autoApproveThreshold: 'autoApproveThreshold',
      maintenanceMode: 'maintenanceMode',
      notificationEmail: 'notificationEmail',
      notificationSms: 'notificationSms',
      platformFeePercent: 'platformFeePercent',
      fixedTransactionFee: 'fixedTransactionFee',
      minimumTransactionAmount: 'minimumTransactionAmount',
      maximumTransactionAmount: 'maximumTransactionAmount',
      aiConfidenceThreshold: 'aiConfidenceThreshold',
      documentToleranceDays: 'documentToleranceDays',
      maxDocumentsPerLand: 'maxDocumentsPerLand',
      aiAutoExtraction: 'aiAutoExtraction',
      groqApiKey: 'groqApiKey',
      webhookUrl: 'webhookUrl',
      blockchainRegistryAddress: 'blockchainRegistryAddress',
      apiRateLimit: 'apiRateLimit',
      webhookRetryAttempts: 'webhookRetryAttempts',
      twoFactorRequired: 'twoFactorRequired',
      sessionTimeoutMinutes: 'sessionTimeoutMinutes',
      ipWhitelistEnabled: 'ipWhitelistEnabled',
      whitelistedIps: 'whitelistedIps',
    };

    for (const [dtoField, settingsField] of Object.entries(fieldMappings)) {
      if ((dto as any)[dtoField] !== undefined) {
        settingsValue[settingsField] = (dto as any)[dtoField];
      }
    }

    await this.prisma.platformSetting.upsert({
      where: { key: 'platform' },
      update: {
        value: settingsValue,
        updatedBy: adminId,
      },
      create: {
        key: 'platform',
        value: settingsValue,
        description: 'Platform-wide settings',
        updatedBy: adminId,
      },
    });

    // Log the action
    await this.prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'SYSTEM',
        message: 'Platform settings updated',
        userId: adminId,
        metadata: { updatedFields: Object.keys(settingsValue) },
      },
    });

    return { message: 'Settings updated successfully' };
  }

  // ============================================================
  // PLATFORM STATS
  // ============================================================

  async getStats() {
    const [
      totalLandRegistered,
      totalVolumeCarbonTonCO2e,
      totalActiveUsers,
      totalSuccessfulTransactions,
      pendingVerifications,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.landPlot.count(),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { volumeTonCO2e: true },
      }),
      this.prisma.user.count({
        where: { status: UserStatus.ACTIVE },
      }),
      this.prisma.transaction.count({
        where: { status: 'COMPLETED' },
      }),
      this.prisma.landPlot.count({
        where: { status: LandPlotStatus.PENDING },
      }),
      this.prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalLandRegistered,
      totalVolumeCarbonTonCO2e: totalVolumeCarbonTonCO2e._sum.volumeTonCO2e ?? 0,
      totalActiveUsers,
      totalSuccessfulTransactions,
      pendingVerifications,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
    };
  }
}
