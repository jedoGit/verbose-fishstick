const express = require("express");
const healthController = require("../controllers/health");
const router = express.Router();


//-----------------
// GET: /healthz
//-----------------
router.get("/healthz", healthController.getSystemHealth);

//-----------------
// GET: /readyz
//-----------------
router.get("/readyz", healthController.getSystemReady);


// Export
module.exports = router;
