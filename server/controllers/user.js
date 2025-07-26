const prisma = require("../config/prisma");

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    if (!id || enabled === undefined) {
      return res.status(400).json({ message: "Missing required fields: id or enabled" });
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserBodyInfo = async (req, res) => {
  try {
    const { name, weight, height, age, gender, bodyFat } = req.body; // เพิ่ม bodyFat
    const userId = req.user.id; // ดึง ID ของผู้ใช้ที่ล็อกอิน

    // ตรวจสอบว่ามีค่าที่ต้องการอัปเดตหรือไม่
    if (!name && !weight && !height && !age && !gender && !bodyFat) {
      return res.status(400).json({ message: "กรุณาใส่ข้อมูลที่ต้องการอัปเดต" });
    }

    // ตรวจสอบค่าที่เป็นตัวเลขให้แน่ใจว่าอยู่ในช่วงที่เหมาะสม
    if (weight && (weight <= 0 || weight > 300)) {
      return res.status(400).json({ message: "น้ำหนักต้องมากกว่า 0 และไม่เกิน 300 kg" });
    }
    if (height && (height <= 0 || height > 250)) {
      return res.status(400).json({ message: "ส่วนสูงต้องมากกว่า 0 และไม่เกิน 250 cm" });
    }
    if (age && (age <= 0 || age > 120)) {
      return res.status(400).json({ message: "อายุต้องอยู่ระหว่าง 1 - 120 ปี" });
    }
    if (bodyFat && (bodyFat < 0 || bodyFat > 50)) {
      return res.status(400).json({ message: "เปอร์เซ็นต์ไขมันต้องอยู่ระหว่าง 0 - 50%" });
    }
    if (gender && !["male", "female"].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: "เพศต้องเป็น male หรือ female เท่านั้น" });
    }

    // อัปเดตข้อมูลปัจจุบันของผู้ใช้ในตาราง User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      },
    });

    // ถ้ามีการอัปเดตน้ำหนัก หรือ % ไขมัน ให้เพิ่มข้อมูลลงใน BodyStat
    if (weight || bodyFat) {
      await prisma.bodyStat.create({
        data: {
          userId: userId,
          weight: weight ? parseFloat(weight) : undefined,
          bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
          recordedAt: new Date(), // บันทึกวันที่ปัจจุบัน
        },
      });
    }

    res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getLatestUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  res.json(users);
};
