-- AddForeignKey
ALTER TABLE `RoomStationInformation` ADD CONSTRAINT `RoomStationInformation_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
