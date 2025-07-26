const express = require('express');
const router = express.Router();
const { calculateTdee, getTdeeResults, listTdee } = require('../controllers/tdee'); // ตรวจสอบตรงนี้!
const { authCheck } = require('../middlewares/authCheck');
const { getTdeeHistory } = require('../controllers/tdee');

router.post('/tdee/calculate',authCheck, calculateTdee);  // ✅ ใช้ calculateTdee ที่ import มา
router.get('/tdee/results', authCheck, getTdeeResults);
router.get('/tdee/list', authCheck, listTdee);
router.get('/tdee/history', authCheck, getTdeeHistory);

module.exports = router;
