const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.use(protect, allowRoles('admin'));
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
