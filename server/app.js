// app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ✅ CORS configuration (IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;