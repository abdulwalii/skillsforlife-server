/*
  Warnings:

  - You are about to alter the column `score` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Choices" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Insurance" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "annualSalary" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "grossMonthlySalary" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "netMonthlySalary" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RoomInitialInformation" ALTER COLUMN "moneyInTheBank" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RoomInsuranceInformation" ALTER COLUMN "moneyInTheBank" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RoomStationInformation" ALTER COLUMN "moneyInTheBank" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "purchaseAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "netMoneyInTheBank" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "score" SET DATA TYPE INTEGER;
