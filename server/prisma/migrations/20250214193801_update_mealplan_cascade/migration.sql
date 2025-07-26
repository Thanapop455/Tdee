-- DropForeignKey
ALTER TABLE `mealplanitem` DROP FOREIGN KEY `MealPlanItem_mealPlanId_fkey`;

-- DropIndex
DROP INDEX `MealPlanItem_mealPlanId_fkey` ON `mealplanitem`;

-- AddForeignKey
ALTER TABLE `MealPlanItem` ADD CONSTRAINT `MealPlanItem_mealPlanId_fkey` FOREIGN KEY (`mealPlanId`) REFERENCES `MealPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
