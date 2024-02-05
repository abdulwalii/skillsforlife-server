/*
  Warnings:

  - Added the required column `name` to the `Choices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Choices` ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `growthInPct` INTEGER NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxCredit` INTEGER NULL,
    MODIFY `price` DOUBLE NULL;
