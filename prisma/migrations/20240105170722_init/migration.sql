-- DropIndex
DROP INDEX `Player_email_key` ON `Player`;

-- AlterTable
ALTER TABLE `Player` ADD COLUMN `school` VARCHAR(191) NULL;
