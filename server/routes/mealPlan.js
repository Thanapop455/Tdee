const express = require('express');
const router = express.Router();
const { 
    createMealPlan, 
    getMealPlans,
    updateMealPlan,
    deleteMealPlan  
} = require('../controllers/mealPlan');
const { authCheck } = require('../middlewares/authCheck');

router.post('/user/meal-plan', authCheck, createMealPlan);
// authCheck, 
router.get('/user/meal-plans', authCheck, getMealPlans);
// authCheck, 
router.put("/meal-plan/:id", authCheck, updateMealPlan);
// ลบ MealPlan
router.delete("/meal-plan/:id", authCheck, deleteMealPlan);
// authCheck, 
module.exports = router;
