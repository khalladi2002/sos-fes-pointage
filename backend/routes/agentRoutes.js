const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const { getAgents, getAgent, createAgent, updateAgent, deleteAgent } = require('../controllers/agentController');

router.use(protect);
router.get('/', getAgents);
router.get('/:id', getAgent);
router.post('/', allowRoles('admin'), createAgent);
router.put('/:id', allowRoles('admin'), updateAgent);
router.delete('/:id', allowRoles('admin'), deleteAgent);

module.exports = router;
