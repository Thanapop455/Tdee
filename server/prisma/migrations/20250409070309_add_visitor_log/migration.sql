/*
  Warnings:

  - You are about to drop the `bodystat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bodystat` DROP FOREIGN KEY `BodyStat_userId_fkey`;

-- DropTable
DROP TABLE `bodystat`;

-- CreateTable
CREATE TABLE `VisitorLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `visitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
