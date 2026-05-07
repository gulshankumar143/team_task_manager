const Project = require('../models/Project');
const User = require('../models/User');
const Joi = require('joi');

// Validation
const projectSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  members: Joi.array().items(Joi.string())
});

// Create project (Admin only)
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;
    const { error } = projectSchema.validate({ name, description, members });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const memberIds = Array.isArray(members) ? members.map(String) : [];
    const uniqueMemberIds = [...new Set([req.user._id.toString(), ...memberIds])];

    // Add creator as project member
    const project = await Project.create({
      name,
      description,
      creator: req.user._id,
      members: uniqueMemberIds
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// Add member (Admin only)
exports.addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (project.members.map((m) => m.toString()).includes(userId)) {
      return res.status(400).json({ message: 'User is already a project member' });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email role');

    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Remove member (Admin only)
exports.removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.members.map((m) => m.toString()).includes(userId)) {
      return res.status(400).json({ message: 'User is not a project member' });
    }

    if (project.creator.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await project.save();
    await project.populate('members', 'name email role');

    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Get projects for user
exports.getUserProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      members: req.user._id
    }).populate('members', 'name email role');
    res.json(projects);
  } catch (err) {
    next(err);
  }
};
