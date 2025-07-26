const prisma = require('../config/prisma');

// ดึงรายการอาหารใน MealPlan
exports.getMealPlanItems = async (req, res) => {
  try {
    const { mealPlanId } = req.params;

    const mealPlanItems = await prisma.mealPlanItem.findMany({
      where: { mealPlanId: parseInt(mealPlanId) },
      include: { food: true }, // ✅ ดึงข้อมูลอาหารมาด้วย
    });

    res.status(200).json(mealPlanItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// เพิ่มรายการอาหารใน MealPlan
exports.addMealPlanItem = async (req, res) => {
  try {
    const { mealPlanId, foodId, mealTime, quantity } = req.body;
    const userId = req.user?.id; // รับ userId จาก Token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    if (!mealPlanId || !foodId || !mealTime || !quantity) {
      return res.status(400).json({ message: "All fields are required: mealPlanId, foodId, mealTime, quantity" });
    }

    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: { id: parseInt(mealPlanId), userId },
    });

    if (!existingMealPlan) {
      return res.status(404).json({ message: "MealPlan not found or you do not have permission" });
    }

    const existingFood = await prisma.food.findUnique({
      where: { id: parseInt(foodId) },
    });

    if (!existingFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    const mealPlanItem = await prisma.mealPlanItem.create({
      data: {
        mealPlanId: parseInt(mealPlanId),
        foodId: parseInt(foodId),
        mealTime,
        quantity: parseFloat(quantity),
      },
    });

    res.status(201).json(mealPlanItem);
  } catch (err) {
    console.error("Error adding MealPlanItem:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// อัปเดตรายการอาหารใน MealPlan
exports.updateMealPlanItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { mealTime, quantity } = req.body;

    // ✅ ตรวจสอบค่า ID และ Quantity
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a valid number greater than zero" });
    }

    // ✅ ตรวจสอบว่ารายการอาหารมีอยู่ใน MealPlan หรือไม่
    const existingMealPlanItem = await prisma.mealPlanItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMealPlanItem) {
      return res.status(404).json({ message: "Meal Plan Item not found" });
    }

    // ✅ อัปเดตข้อมูล
    const updatedMealPlanItem = await prisma.mealPlanItem.update({
      where: { id: parseInt(id) },
      data: {
        mealTime,
        quantity: parsedQuantity,
      },
    });

    res.status(200).json(updatedMealPlanItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ลบรายการอาหารใน MealPlan
exports.deleteMealPlanItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    // ✅ ตรวจสอบว่ารายการมีอยู่หรือไม่
    const existingItem = await prisma.mealPlanItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Meal Plan Item not found" });
    }

    await prisma.mealPlanItem.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Meal Plan Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

