const prisma = require("../config/prisma");

exports.getWeightRecords = async (req, res) => {
  try {
    const userId = req.user.id; // ใช้ userId จาก Token
    const weightRecords = await prisma.weightRecord.findMany({
      where: { userId },
      orderBy: { recordedAt: "asc" }, // เรียงตามวันที่
    });

    res.status(200).json(weightRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// เพิ่มข้อมูลน้ำหนักใหม่
exports.addWeightRecord = async (req, res) => {
  try {
    let { weight, recordedAt } = req.body;
    const userId = req.user?.id;

    console.log("📌 ข้อมูลที่รับมา:", { weight, recordedAt, userId });

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!weight || isNaN(parseFloat(weight))) {
      return res.status(400).json({ message: "น้ำหนักไม่ถูกต้อง" });
    }

    if (!recordedAt || isNaN(Date.parse(recordedAt))) {
      return res.status(400).json({ message: "วันที่ไม่ถูกต้อง" });
    }

    weight = parseFloat(weight);

    const newRecord = await prisma.weightRecord.create({
      data: {
        userId,
        weight,
        recordedAt: new Date(recordedAt),
      },
    });

    console.log("✅ บันทึกสำเร็จ:", newRecord);

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("❌ Error adding weight record:", err);
    res.status(500).json({ message: "Server Error" });
  }
};




// แก้ไขข้อมูลน้ำหนักเดิม
exports.updateWeightRecord = async (req, res) => {
  try {
    const { id, weight } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่า Record นี้เป็นของผู้ใช้หรือไม่
    const existingRecord = await prisma.weightRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRecord || existingRecord.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this record" });
    }

    const updatedRecord = await prisma.weightRecord.update({
      where: { id: parseInt(id) },
      data: { weight: parseFloat(weight) },
    });

    res.status(200).json(updatedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteWeightRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // ตรวจสอบว่า Record เป็นของผู้ใช้หรือไม่
    const record = await prisma.weightRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record || record.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this record" });
    }

    await prisma.weightRecord.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Weight record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};