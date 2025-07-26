const prisma = require("../config/prisma");

exports.addBodyStat = async (req, res) => {
    try {
      const { weight, bodyFat, waist, hips, chest } = req.body;
      const userId = req.user.id; // ดึง userId จาก JWT token

      const bodyStat = await prisma.bodyStat.create({
        data: { 
          userId, 
          weight, 
          bodyFat, 
          waist, 
          hips, 
          chest,
          recordedAt: new Date(), // บันทึกวันที่อัตโนมัติ
        },
      });
      res.status(201).json(bodyStat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};

exports.getBodyStats = async (req, res) => {
    try {
      const userId = req.user.id;
      const bodyStats = await prisma.bodyStat.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' }, // เรียงจากล่าสุด -> เก่าสุด
      });
      res.status(200).json(bodyStats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};
