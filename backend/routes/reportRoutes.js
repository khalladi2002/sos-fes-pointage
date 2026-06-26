const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const { exportPdf, exportExcel } = require('../controllers/reportController');

router.use(protect);
router.get('/pdf', exportPdf);
router.get('/excel', exportExcel);

module.exports = router;
