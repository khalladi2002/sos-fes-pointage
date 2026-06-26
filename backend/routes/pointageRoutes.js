const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const { getPointages, saveBulkPointages, updatePointage, getAlerts } = require('../controllers/pointageController');

router.use(protect);
router.get('/', getPointages);
router.get('/alerts', getAlerts);
router.post('/bulk', allowRoles('admin', 'responsable'), saveBulkPointages);
router.put('/:id', allowRoles('admin', 'responsable'), updatePointage);

module.exports = router;
