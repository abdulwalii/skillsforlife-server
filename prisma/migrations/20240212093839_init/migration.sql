/*
  Warnings:

  - You are about to drop the column `moneyInTheBank` on the `RoomStationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `netMoneyInTheBank` on the `RoomStationInformation` table. All the data in the column will be lost.
  - Added the required column `choiceId` to the `RoomStationInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentAmount` to the `RoomStationInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netAmount` to the `RoomStationInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RoomStationInformation` DROP COLUMN `moneyInTheBank`,
    DROP COLUMN `netMoneyInTheBank`,
    ADD COLUMN `choiceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `currentAmount` DOUBLE NOT NULL,
    ADD COLUMN `growth` DOUBLE NULL,
    ADD COLUMN `internalChoiceId` VARCHAR(191) NULL,
    ADD COLUMN `netAmount` DOUBLE NOT NULL,
    ADD COLUMN `taxCredit` DOUBLE NULL;
