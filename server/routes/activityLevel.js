const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityLevel');

router.get('/activities', getActivities);
module.exports = router;
