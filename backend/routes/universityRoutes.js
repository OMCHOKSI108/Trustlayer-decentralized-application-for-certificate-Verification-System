const express = require("express");
const router = express.Router();
const universityController = require("../controllers/universityController");

// GET /api/universities/search?name=...
router.get("/search", universityController.searchUniversities);

module.exports = router;
