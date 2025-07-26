const express = require("express");
const router = express.Router();
const { getWeightRecords, addWeightRecord, updateWeightRecord, deleteWeightRecord } = require("../controllers/weight");
const { authCheck } = require("../middlewares/authCheck");

router.get("/weights", authCheck, getWeightRecords);
router.post("/weights", authCheck, addWeightRecord);
router.put("/weights", authCheck, updateWeightRecord);
router.delete("/weights/:id", authCheck, deleteWeightRecord);

module.exports = router;
