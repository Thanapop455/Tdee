const prisma = require('../config/prisma');

exports.trackVisitor = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await prisma.visitorLog.create({
      data: { ip, userAgent }
    });

    res.json({ message: "Visitor logged" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error tracking visitor" });
  }
};

exports.getVisitorCount = async (req, res) => {
  try {
    const count = await prisma.visitorLog.count();
    res.json({ total: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting visitor count" });
  }
};
