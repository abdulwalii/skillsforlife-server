-- CreateTable
CREATE TABLE `InternalChoices` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NULL,
    `duration` VARCHAR(191) NULL,
    `choiceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InternalChoices` ADD CONSTRAINT `InternalChoices_choiceId_fkey` FOREIGN KEY (`choiceId`) REFERENCES `Choices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
