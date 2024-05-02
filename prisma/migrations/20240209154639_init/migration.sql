-- AddForeignKey
ALTER TABLE `RoomInsuranceInformation` ADD CONSTRAINT `RoomInsuranceInformation_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
