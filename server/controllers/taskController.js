const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const Joi = require('joi');

// Validation
const taskSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done'),
  project: Joi.string().required(),
  assignedTo: Joi.string().required()
});

// Create task (Admin only)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status, project, assignedTo } = req.body;
    const { error } = taskSchema.validate({ title, description, dueDate, priority, status, project, assignedTo });
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check project and user
    const projectObj = await Project.findById(project);
    if (!projectObj) return res.status(404).json({ message: 'Project not found' });

    const userObj = await User.findById(assignedTo);
    if (!userObj) return res.status(404).json({ message: 'Assigned user not found' });

    // Only assign to project members
    if (!projectObj.members.includes(userObj._id)) {
      return res.status(400).json({ message: 'User is not a member of this project' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status: status || 'To Do',
      project,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Get tasks for user (Member: only their tasks, Admin: all project tasks)
exports.getTasks = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'Member') {
      filter.assignedTo = req.user._id;
    } else if (req.query.project) {
      filter.project = req.query.project;
    }
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Update task status (Members: only their tasks)
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const assignedId = String(task.assignedTo);
    const currentUserId = String(req.user._id);

    if (req.user.role !== 'Admin' && assignedId !== currentUserId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const allowedStatuses = ['To Do', 'In Progress', 'Done'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    task.status = status;
    await task.save();
    await task.populate('assignedTo', 'name email').populate('project', 'name');
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Get single task detail
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin' && String(task.assignedTo._id || task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Dashboard stats
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'Admin';

    // Total tasks
    const totalTasks = await Task.countDocuments(
      isAdmin ? {} : { assignedTo: userId }
    );

    // Tasks grouped by status
    const groupByStatus = await Task.aggregate([
      { $match: isAdmin ? {} : { assignedTo: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Tasks per user (Admin only)
    let tasksPerUser = [];
    if (isAdmin) {
      tasksPerUser = await Task.aggregate([
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            userId: '$user._id',
            name: '$user.name',
            email: '$user.email',
            count: 1
          }
        }
      ]);
    }

    // Overdue tasks
    const overdueTasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' },
      ...(isAdmin ? {} : { assignedTo: userId })
    });

    res.json({
      totalTasks,
      groupByStatus,
      tasksPerUser,
      overdueTasks
    });
  } catch (err) {
    next(err);
  }
};
