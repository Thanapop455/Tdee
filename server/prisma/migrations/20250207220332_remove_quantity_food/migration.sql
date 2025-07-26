/*
  Warnings:

  - You are about to drop the column `quantity` on the `food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `food` DROP COLUMN `quantity`;

-- AlterTable
ALTER TABLE `mealplanitem` MODIFY `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `weight` INTEGER NULL,
    MODIFY `height` INTEGER NULL;
