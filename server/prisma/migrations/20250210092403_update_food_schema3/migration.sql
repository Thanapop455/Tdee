/*
  Warnings:

  - You are about to alter the column `calorie` on the `food` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `food` MODIFY `calorie` DOUBLE NULL;
