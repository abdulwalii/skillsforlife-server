-- AddForeignKey
ALTER TABLE `RoomInitialInformation` ADD CONSTRAINT `RoomInitialInformation_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomInitialInformation` ADD CONSTRAINT `RoomInitialInformation_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
