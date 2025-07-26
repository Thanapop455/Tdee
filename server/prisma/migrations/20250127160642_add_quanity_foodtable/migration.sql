/*
  Warnings:

  - Added the required column `quantity` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `food` ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `asset_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
