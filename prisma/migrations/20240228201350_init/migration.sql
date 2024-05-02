/*
  Warnings:

  - You are about to drop the column `city` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `classCode` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `parentEmail` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `parentFullName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `parentPhoneNumber` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Player` table. All the data in the column will be lost.
  - Made the column `phoneNumber` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Player` DROP COLUMN `city`,
    DROP COLUMN `classCode`,
    DROP COLUMN `parentEmail`,
    DROP COLUMN `parentFullName`,
    DROP COLUMN `parentPhoneNumber`,
    DROP COLUMN `school`,
    DROP COLUMN `state`,
    MODIFY `phoneNumber` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;
