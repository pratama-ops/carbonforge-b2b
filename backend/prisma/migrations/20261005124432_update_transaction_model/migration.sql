/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `buyerId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `creditsTransferred` on the `Transaction` table. All the data in the column will be lost.
  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exporterId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landPlotId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_matchId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amountPaid",
DROP COLUMN "buyerId",
DROP COLUMN "creditsTransferred",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "exporterId" TEXT NOT NULL,
ADD COLUMN     "landPlotId" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "matchId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "TxStatus";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matchmaking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_landPlotId_fkey" FOREIGN KEY ("landPlotId") REFERENCES "LandPlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
