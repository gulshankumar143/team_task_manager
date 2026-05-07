const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.get('/', protect, authorize(ROLES.ADMIN), getAllUsers);

module.exports = router;
