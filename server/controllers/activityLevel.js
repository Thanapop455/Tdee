const prisma = require("../config/prisma");

exports.getActivities = async (req, res) => {
    try {
        const activities = await prisma.activityLevel.findMany();
        res.status(200).json(activities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
