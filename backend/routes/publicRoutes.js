const express = require("express");
const router = express.Router();
const { verifyPublic, verifyCertificateByIdPublic } = require("../controllers/verifyController");

// Public verification endpoint (No Auth)
router.post("/verify", verifyPublic);
router.get("/certificate/:certId", verifyCertificateByIdPublic);

module.exports = router;
