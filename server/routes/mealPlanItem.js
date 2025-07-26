const express = require('express');
const router = express.Router();
const { 
  getMealPlanItems, 
  addMealPlanItem, 
  updateMealPlanItem, 
  deleteMealPlanItem 
} = require('../controllers/mealPlanItem');
const { authCheck } = require('../middlewares/authCheck');

// ดึงรายการอาหารทั้งหมดใน MealPlan
router.get('/meal-plan/:mealPlanId/items', authCheck, getMealPlanItems);
// authCheck,
// เพิ่มรายการอาหารใน MealPlan
router.post('/meal-plan/:mealPlanId/items', authCheck, addMealPlanItem);
// authCheck,
// อัปเดตรายการอาหารใน MealPlan
router.put('/meal-plan/item/:id', authCheck, updateMealPlanItem);
// authCheck,
// ลบรายการอาหารใน MealPlan
router.delete('/meal-plan/item/:id', authCheck, deleteMealPlanItem);
// authCheck,
module.exports = router;
