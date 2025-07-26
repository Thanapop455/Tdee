/*
  Warnings:

  - You are about to drop the column `price` on the `food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `food` DROP COLUMN `price`;

-- CreateTable
CREATE TABLE `BodyStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `weight` DOUBLE NULL,
    `bodyFat` DOUBLE NULL,
    `waist` DOUBLE NULL,
    `hips` DOUBLE NULL,
    `chest` DOUBLE NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BodyStat` ADD CONSTRAINT `BodyStat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
