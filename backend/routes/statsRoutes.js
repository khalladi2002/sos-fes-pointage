const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getOverview,
  getPresenceParJour,
  getPresenceParSecteur,
  getAbsencesMensuelles
} = require('../controllers/statsController');

router.use(protect);
router.get('/overview', getOverview);
router.get('/presence-par-jour', getPresenceParJour);
router.get('/presence-par-secteur', getPresenceParSecteur);
router.get('/absences-mensuelles', getAbsencesMensuelles);

module.exports = router;
