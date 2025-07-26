const express = require("express");
const router = express.Router();
const { trackVisitor, getVisitorCount } = require("../controllers/visitor");

router.post("/track", trackVisitor);
router.get("/count", getVisitorCount);

module.exports = router;
