-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LANDOWNER', 'CORPORATE_BUYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING', 'PROCESSING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LandPlotStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VegetationType" AS ENUM ('Mangrove', 'Tropical_Rainforest', 'Peatland');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SUGGESTED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'IN_ESCROW', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'SECURITY');

-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('AUTH', 'VERIFICATION', 'TRANSACTION', 'USER_MANAGEMENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('ACTIVE', 'RETIRED', 'PENDING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'LANDOWNER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT,
    "address" TEXT,
    "walletAddress" TEXT,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "landPlotId" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'PDF',
    "fileSize" INTEGER,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "extractedData" JSONB,
    "aiConfidence" DOUBLE PRECISION,
    "cbamScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carbon_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_plots" (
    "id" TEXT NOT NULL,
    "landownerId" TEXT NOT NULL,
    "plotName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "areaHa" DOUBLE PRECISION NOT NULL,
    "vegetationType" "VegetationType" NOT NULL,
    "estimatedCarbonCredits" DOUBLE PRECISION NOT NULL,
    "carbonCapacity" DOUBLE PRECISION NOT NULL,
    "documentUrl" TEXT,
    "status" "LandPlotStatus" NOT NULL DEFAULT 'PENDING',
    "ndviScore" DOUBLE PRECISION,
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchmaking" (
    "id" TEXT NOT NULL,
    "documentId" TEXT,
    "landPlotId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "matchedScore" DOUBLE PRECISION NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SUGGESTED',
    "filterCriteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matchmaking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "matchId" TEXT,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "landPlotId" TEXT NOT NULL,
    "volumeTonCO2e" DOUBLE PRECISION NOT NULL,
    "pricePerTon" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "escrowReleasedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_certificates" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "landPlotId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "volumeTonCO2e" DOUBLE PRECISION NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retiredAt" TIMESTAMP(3),
    "retirementReason" TEXT,

    CONSTRAINT "carbon_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "category" "LogCategory" NOT NULL DEFAULT 'SYSTEM',
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_matchId_key" ON "transactions"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "carbon_certificates_certificateId_key" ON "carbon_certificates"("certificateId");

-- CreateIndex
CREATE UNIQUE INDEX "carbon_certificates_transactionId_key" ON "carbon_certificates"("transactionId");

-- CreateIndex
CREATE INDEX "system_logs_level_category_idx" ON "system_logs"("level", "category");

-- CreateIndex
CREATE INDEX "system_logs_createdAt_idx" ON "system_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "platform_settings_key_key" ON "platform_settings"("key");

-- AddForeignKey
ALTER TABLE "carbon_documents" ADD CONSTRAINT "carbon_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_documents" ADD CONSTRAINT "carbon_documents_landPlotId_fkey" FOREIGN KEY ("landPlotId") REFERENCES "land_plots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_plots" ADD CONSTRAINT "land_plots_landownerId_fkey" FOREIGN KEY ("landownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchmaking" ADD CONSTRAINT "matchmaking_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "carbon_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchmaking" ADD CONSTRAINT "matchmaking_landPlotId_fkey" FOREIGN KEY ("landPlotId") REFERENCES "land_plots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matchmaking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_landPlotId_fkey" FOREIGN KEY ("landPlotId") REFERENCES "land_plots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_certificates" ADD CONSTRAINT "carbon_certificates_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_certificates" ADD CONSTRAINT "carbon_certificates_landPlotId_fkey" FOREIGN KEY ("landPlotId") REFERENCES "land_plots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
