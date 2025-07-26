
// คำนวณ TDEE
const prisma = require("../config/prisma");

exports.calculateTdee = async (req, res) => {
  try {
    const { weight, height, age, gender, activityId } = req.body;
    const userId = req.user ? req.user.id : null; // ตรวจสอบว่า User ล็อกอินหรือไม่

    console.log(" ค่าที่รับจาก Frontend:", { weight, height, age, gender, activityId, userId });

    if (!weight || !height || !age || !gender || !activityId) {
      return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      return res.status(400).json({ message: "❌ ข้อมูลต้องเป็นตัวเลข" });
    }

    //คำนวณ BMR
    const bmr = gender === "male"
      ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    console.log("✅ คำนวณ BMR:", bmr);

    //ค้นหา Activity Level
    const activity = await prisma.activityLevel.findUnique({
      where: { id: parseInt(activityId) }, //แปลงเป็น Int
    });
    

    if (!activity) {
      console.log("❌ ไม่พบ Activity Level ที่เลือก:", activityId);
      return res.status(400).json({ message: "ระดับกิจกรรมไม่ถูกต้อง" });
    }

    console.log("✅ ค่า Activity Multiplier:", activity.multiplier);

    // ✅ คำนวณค่า TDEE
    const tdee = Math.round(bmr * activity.multiplier);
    console.log("🔥 ค่า TDEE คำนวณได้:", tdee);

    let tdeeResult = null;

    if (userId) {
      tdeeResult = await prisma.tdeeResult.create({
        data: { userId, activityId, tdee , bmr},
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          weight: weightNum,
          height: heightNum,
          age: ageNum,
          gender: gender,
        },
      });

      console.log(" บันทึกค่า TDEE ลงฐานข้อมูลแล้ว:", tdeeResult);
    } else {
      console.log("⚠️ ไม่ได้บันทึก TDEE เพราะผู้ใช้ไม่ได้ล็อกอิน");
    }

    res.status(201).json({
      message: "TDEE calculated successfully",
      tdeeResult,
      details: { bmr, tdee, activityMultiplier: activity.multiplier },
      savedToDatabase: !!userId,
    });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในเซิร์ฟเวอร์:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



// ดึงข้อมูล TDEE
exports.getTdeeResults = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    const tdeeResults = await prisma.tdeeResult.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { createdAt: "desc" },
    });

    if (tdeeResults.length === 0) {
      return res.status(200).json({ message: "ไม่พบผลลัพธ์ TDEE" });
    }

    res.status(200).json(tdeeResults);
  } catch (err) {
    console.error("❌ Error fetching TDEE results:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listTdee = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }
    const tdeeList = await prisma.tdeeResult.findMany({
      where: { userId },
      include: { 
        user: { select: { weight: true, height: true, age: true, gender: true } },
        activity: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(tdeeList);
  } catch (err) {
    console.error("❌ Error fetching TDEE list:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getTdeeHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await prisma.tdeeResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.send(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
