const express = require('express');
const router = express.Router();
const { addBodyStat, getBodyStats } = require('../controllers/bodyStat');
const { authCheck } = require('../middlewares/authCheck');

router.post('/bodystat', authCheck, addBodyStat);
// authCheck,
router.get('/bodystats', authCheck, getBodyStats);
// authCheck,
module.exports = router;
