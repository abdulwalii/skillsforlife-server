-- AlterTable
ALTER TABLE `RoomStationInformation` ADD COLUMN `bankType` ENUM('piggy', 'investment', 'saving') NULL,
    ADD COLUMN `deposit` DOUBLE NULL;
