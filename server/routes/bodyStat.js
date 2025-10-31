const express = require('express');
const router = express.Router();
const { addBodyStat, getBodyStats } = require('../controllers/bodyStat');
const { authCheck } = require('../middlewares/authCheck');

router.post('/bodystat', authCheck, addBodyStat);
router.get('/bodystats', authCheck, getBodyStats);

module.exports = router;
