/*
  Warnings:

  - You are about to alter the column `bgImage` on the `Station` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `thumbnailImage` on the `Station` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Station` MODIFY `bgImage` JSON NULL,
    MODIFY `thumbnailImage` JSON NULL;
