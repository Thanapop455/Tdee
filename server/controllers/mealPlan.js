const prisma = require("../config/prisma");

exports.createMealPlan = async (req, res) => {
  try {
    const { name, dailyCalorie, items = [] } = req.body;
    const userId = req.user?.id; // รับ userId จาก Token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    if (!name || !dailyCalorie) {
      return res.status(400).json({ message: "Name and dailyCalorie are required" });
    }

    // ✅ ตรวจสอบว่าค่า TDEE ล่าสุดมีอยู่หรือไม่
    const latestTdee = await prisma.tdeeResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        name,
        dailyCalorie: parseFloat(dailyCalorie),
        tdee: latestTdee ? latestTdee.tdee : 0, // ถ้าไม่มีให้ใส่ค่า default = 0
        items: {
          create: items.map((item) => ({
            foodId: parseInt(item.foodId),
            mealTime: item.mealTime,
            quantity: parseFloat(item.quantity),
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(mealPlan);
  } catch (err) {
    console.error("Error creating MealPlan:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.getMealPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ ดึงค่า TDEE ล่าสุดของผู้ใช้
    const latestTdee = await prisma.tdeeResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // ✅ ดึง MealPlans และส่งค่า TDEE ล่าสุดไปด้วย
    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId },
      include: { items: true },
    });

    res.json({
      latestTdee: latestTdee ? latestTdee.tdee : null, // ส่งค่า TDEE ล่าสุดไปด้วย
      mealPlans,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของ MealPlan
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!mealPlan || mealPlan.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this MealPlan" });
    }

    // ลบ MealPlan และ MealPlanItems ที่เกี่ยวข้อง
    await prisma.mealPlan.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "MealPlan deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params; // รับ `id` ของ Meal Plan
    let { name, dailyCalorie, items = [] } = req.body;
    const userId = req.user.id;

    // ✅ ตรวจสอบว่า Meal Plan มีอยู่จริงหรือไม่
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });

    if (!mealPlan || mealPlan.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this MealPlan" });
    }

    // ✅ ตรวจสอบค่า `name` และ `dailyCalorie` (ป้องกัน `undefined`)
    if (!name) {
      name = mealPlan.name; // ใช้ค่าเดิมถ้า `name` ไม่ได้ถูกส่งมา
    }

    if (!dailyCalorie || isNaN(dailyCalorie)) {
      dailyCalorie = mealPlan.dailyCalorie; // ใช้ค่าเดิมถ้า `dailyCalorie` ไม่ถูกต้อง
    } else {
      dailyCalorie = parseFloat(dailyCalorie); // แปลงเป็นตัวเลข
    }

    // ✅ อัปเดตชื่อและค่าแคลอรี่
    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id: parseInt(id) },
      data: {
        name,
        dailyCalorie,
      },
    });

    // ✅ ลบรายการอาหารเดิมทั้งหมด (เพื่อความง่าย)
    await prisma.mealPlanItem.deleteMany({
      where: { mealPlanId: parseInt(id) },
    });

    // ✅ เพิ่มรายการอาหารใหม่
    const newItems = items.map((item) => ({
      mealPlanId: parseInt(id),
      foodId: parseInt(item.foodId),
      mealTime: item.mealTime,
      quantity: parseFloat(item.quantity),
    }));

    await prisma.mealPlanItem.createMany({
      data: newItems,
    });

    res.status(200).json({ message: "Meal Plan updated successfully", mealPlan: updatedMealPlan });
  } catch (err) {
    console.error("❌ Error updating MealPlan:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

