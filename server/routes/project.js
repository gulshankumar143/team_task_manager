const express = require('express');
const router = express.Router();
const {
  createProject,
  addMember,
  removeMember,
  getUserProjects
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

// Create project
router.post('/', protect, authorize(ROLES.ADMIN), createProject);

// Add member
router.post('/:id/add-member', protect, authorize(ROLES.ADMIN), addMember);

// Remove member
router.post('/:id/remove-member', protect, authorize(ROLES.ADMIN), removeMember);

// Get projects for user
router.get('/', protect, getUserProjects);

module.exports = router;
