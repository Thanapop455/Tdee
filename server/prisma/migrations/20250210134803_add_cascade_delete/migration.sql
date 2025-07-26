-- DropForeignKey
ALTER TABLE `burnmethod` DROP FOREIGN KEY `BurnMethod_foodId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_foodId_fkey`;

-- DropForeignKey
ALTER TABLE `mealplanitem` DROP FOREIGN KEY `MealPlanItem_foodId_fkey`;

-- DropIndex
DROP INDEX `BurnMethod_foodId_fkey` ON `burnmethod`;

-- DropIndex
DROP INDEX `Image_foodId_fkey` ON `image`;

-- DropIndex
DROP INDEX `MealPlanItem_foodId_fkey` ON `mealplanitem`;

-- AddForeignKey
ALTER TABLE `BurnMethod` ADD CONSTRAINT `BurnMethod_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealPlanItem` ADD CONSTRAINT `MealPlanItem_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
