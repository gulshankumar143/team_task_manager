const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTaskStatus,
  getDashboard
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

// Create task (Admin only)
router.post('/', protect, authorize(ROLES.ADMIN), createTask);

// Get tasks (Admin: all, Member: only their tasks)
router.get('/', protect, getTasks);

// Update task status (assigned user or Admin)
router.patch('/:id/status', protect, updateTaskStatus);

// Dashboard stats
router.get('/dashboard/summary', protect, getDashboard);

module.exports = router;
