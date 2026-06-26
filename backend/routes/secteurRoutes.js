const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const {
  getSecteurs,
  getSecteur,
  createSecteur,
  updateSecteur,
  deleteSecteur
} = require('../controllers/secteurController');

router.use(protect);
router.get('/', getSecteurs);
router.get('/:id', getSecteur);
router.post('/', allowRoles('admin'), createSecteur);
router.put('/:id', allowRoles('admin'), updateSecteur);
router.delete('/:id', allowRoles('admin'), deleteSecteur);

module.exports = router;
