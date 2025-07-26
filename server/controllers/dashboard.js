// controllers/dashboard.js
const prisma = require('../config/prisma')

exports.getDashboardSummary = async (req, res) => {
  try {
    const users = await prisma.user.count();
    const foods = await prisma.food.count();
    const tdee = await prisma.tdeeResult.count();
    const plans = await prisma.mealPlan.count();
    const weights = await prisma.weightRecord.count();
    const visitors = await prisma.visitorLog.count(); // เพิ่มตรงนี้

    res.json({
      users,
      foods,
      tdee,
      plans,
      weights,
      visitors, // เพิ่มตรงนี้
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/dashboard.js
exports.getTDEETrend = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        key: date.toISOString().split("T")[0], // YYYY-MM-DD
        label: date.toLocaleDateString("th-TH", { weekday: "short" }), // จ, อ, พ ...
        count: 0,
      };
    });

    const raw = await prisma.$queryRaw`
      SELECT DATE(createdAt) AS date, COUNT(*) AS count
      FROM tdeeResult
      WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(createdAt)
    `;

    // รวมข้อมูลจริงเข้า array
    raw.forEach((item) => {
      const key = item.date.toISOString().split("T")[0];
      const found = last7Days.find((d) => d.key === key);
      if (found) {
        found.count = Number(item.count);
      }
    });

    const final = last7Days.map(({ label, count }) => ({ day: label, count }));
    res.json(final);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get TDEE trend" });
  }
};
