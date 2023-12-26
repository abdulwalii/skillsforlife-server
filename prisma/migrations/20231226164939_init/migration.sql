/*
  Warnings:

  - You are about to drop the column `userId` on the `RoomInitialInformation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RoomInsuranceInformation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RoomStationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerId` to the `RoomInitialInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `RoomInsuranceInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `RoomStationInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- AlterTable
ALTER TABLE "RoomInitialInformation" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomInsuranceInformation" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomStationInformation" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "parentFullName" TEXT NOT NULL,
    "parentPhoneNumber" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "classCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_id_key" ON "Player"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
