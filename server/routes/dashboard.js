const express = require("express");
const router = express.Router();

const { 
    getDashboardSummary,
    getTDEETrend,
} = require("../controllers/dashboard");
const { authCheck, adminCheck } = require('../middlewares/authCheck')


router.get("/summary", authCheck, adminCheck, getDashboardSummary);
router.get("/tdee-trend", authCheck, adminCheck, getTDEETrend);

module.exports = router;
