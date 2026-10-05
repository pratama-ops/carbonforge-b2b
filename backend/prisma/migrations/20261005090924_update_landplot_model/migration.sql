/*
  Warnings:

  - You are about to drop the column `carbonCreditsAvailable` on the `LandPlot` table. All the data in the column will be lost.
  - You are about to drop the column `locationCoords` on the `LandPlot` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `LandPlot` table. All the data in the column will be lost.
  - You are about to drop the column `totalAreaHectare` on the `LandPlot` table. All the data in the column will be lost.
  - Added the required column `areaSize` to the `LandPlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbonCapacity` to the `LandPlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentUrl` to the `LandPlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landownerId` to the `LandPlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `LandPlot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LandPlotStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "LandPlot" DROP CONSTRAINT "LandPlot_ownerId_fkey";

-- AlterTable
ALTER TABLE "LandPlot" DROP COLUMN "carbonCreditsAvailable",
DROP COLUMN "locationCoords",
DROP COLUMN "ownerId",
DROP COLUMN "totalAreaHectare",
ADD COLUMN     "areaSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carbonCapacity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "documentUrl" TEXT NOT NULL,
ADD COLUMN     "landownerId" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "status" "LandPlotStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "LandPlot" ADD CONSTRAINT "LandPlot_landownerId_fkey" FOREIGN KEY ("landownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
