import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carbonforge.id' },
    update: {},
    create: {
      email: 'admin@carbonforge.id',
      passwordHash: adminPassword,
      name: 'Platform Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample landowner
  const landownerPassword = await bcrypt.hash('landowner123', 12);
  const landowner = await prisma.user.upsert({
    where: { email: 'landowner@example.com' },
    update: {},
    create: {
      email: 'landowner@example.com',
      passwordHash: landownerPassword,
      name: 'Budi Santoso',
      role: 'LANDOWNER',
      status: 'ACTIVE',
      phone: '+62 812-3456-7890',
      address: 'Jl. Mangrove No. 123, Jakarta Selatan',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    },
  });
  console.log(`✅ Landowner user created: ${landowner.email}`);

  // Create sample corporate buyer
  const corporatePassword = await bcrypt.hash('corporate123', 12);
  const corporate = await prisma.user.upsert({
    where: { email: 'corporate@example.com' },
    update: {},
    create: {
      email: 'corporate@example.com',
      passwordHash: corporatePassword,
      name: 'PT Green Energy Indonesia',
      role: 'CORPORATE_BUYER',
      status: 'ACTIVE',
      phone: '+62 21-1234-5678',
      address: 'Jl. Sudirman No. 456, Jakarta Pusat',
    },
  });
  console.log(`✅ Corporate buyer created: ${corporate.email}`);

  // Create platform settings
  await prisma.platformSetting.upsert({
    where: { key: 'platform' },
    update: {},
    create: {
      key: 'platform',
      value: {
        platformName: 'CarbonForge B2B',
        supportEmail: 'support@carbonforge.id',
        maxLandAreaHa: 10000,
        verificationRequired: true,
        autoApproveThreshold: 80,
        maintenanceMode: false,
        notificationEmail: true,
        notificationSms: false,
        platformFeePercent: 2.5,
        fixedTransactionFee: 0,
        minimumTransactionAmount: 100,
        maximumTransactionAmount: 1000000,
        aiConfidenceThreshold: 0.75,
        documentToleranceDays: 30,
        maxDocumentsPerLand: 5,
        aiAutoExtraction: true,
        groqApiKey: '',
        webhookUrl: '',
        blockchainRegistryAddress: '',
        apiRateLimit: 100,
        webhookRetryAttempts: 3,
        twoFactorRequired: false,
        sessionTimeoutMinutes: 60,
        ipWhitelistEnabled: false,
        whitelistedIps: [],
      },
      description: 'Platform-wide settings',
      updatedBy: admin.id,
    },
  });
  console.log('✅ Platform settings created');

  // Create sample land plot
  const landPlot = await prisma.landPlot.create({
    data: {
      landownerId: landowner.id,
      plotName: 'Lahan Mangrove Pantai Indah',
      location: 'Pantai Indah Kapuk, Jakarta Utara',
      latitude: -6.1052,
      longitude: 106.7428,
      areaHa: 150.5,
      vegetationType: 'Mangrove',
      estimatedCarbonCredits: 2500,
      carbonCapacity: 2500,
      status: 'VERIFIED',
      ndviScore: 0.85,
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });
  console.log(`✅ Sample land plot created: ${landPlot.plotName}`);

  // Create sample transaction
  const transaction = await prisma.transaction.create({
    data: {
      buyerId: corporate.id,
      sellerId: landowner.id,
      landPlotId: landPlot.id,
      volumeTonCO2e: 500,
      pricePerTon: 25,
      totalAmount: 12500,
      platformFee: 312.5,
      netAmount: 12187.5,
      status: 'COMPLETED',
      escrowReleasedAt: new Date(),
    },
  });
  console.log(`✅ Sample transaction created: ${transaction.id}`);

  // Create sample certificate
  await prisma.carbonCertificate.create({
    data: {
      certificateId: `CF-2026-${transaction.id.slice(0, 8).toUpperCase()}`,
      transactionId: transaction.id,
      landPlotId: landPlot.id,
      buyerId: corporate.id,
      volumeTonCO2e: 500,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Sample certificate created');

  // Create sample system log
  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      category: 'SYSTEM',
      message: 'Database seeded successfully',
      userId: admin.id,
    },
  });
  console.log('✅ Sample system log created');

  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📋 Login credentials:');
  console.log('   Admin:         admin@carbonforge.id / admin12345');
  console.log('   Landowner:     landowner@example.com / landowner123');
  console.log('   Corporate:     corporate@example.com / corporate123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
