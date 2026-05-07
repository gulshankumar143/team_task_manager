# Team Task Manager

A full-stack project management and task tracking application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication.

## Live Demo
- Frontend: https://team-task-manager-frontend-lt1i.onrender.com/
- Backend API: https://team-task-manager-backend-newu.onrender.com/api

## Project Overview
Team Task Manager allows teams to:
- Sign up and log in securely using JWT authentication
- Create projects and manage project members
- Assign tasks to users, set priority and due date
- Update task status across `To Do`, `In Progress`, and `Done`
- View dashboard metrics and overdue tasks

## Key Features
- **Role-based access**: Admin and Member roles
- **Project creation**: Admin users can create projects
- **Member management**: Admin can add/remove members for a project
- **Task management**: Admin can create tasks and assign them to project members
- **Status updates**: Tasks can be updated by assigned users or Admin
- **Dashboard**: Shows total tasks, status summary, tasks per user, and overdue task details
- **Deployment-ready**: configured for production with deployed frontend and backend

## Tech Stack
- Frontend
  - React 18
  - Vite
  - Tailwind CSS
  - React Router DOM
  - Axios
- Backend
  - Node.js
  - Express
  - MongoDB / Mongoose
  - JWT authentication
  - Joi validation
- Deployment
  - Render (deployed frontend + backend)

## Repository Structure
```
Team Task Manager/
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
├── server/               # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

## Setup Instructions

### Backend
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `server/` with the following values:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Verify the backend is running at:
   - `http://localhost:5000/api`
   - `http://localhost:5000/api/health`

### Frontend
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `client/` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Visit the app in the browser at the Vite URL shown in terminal (usually `http://localhost:5173`).

## API Endpoints
### Authentication
- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — log in and receive a JWT

### Users
- `GET /api/users` — list users (Admin only)

### Projects
- `GET /api/projects` — get projects assigned to the current user
- `POST /api/projects` — create a new project (Admin only)
- `POST /api/projects/:id/add-member` — add a member to a project (Admin only)
- `POST /api/projects/:id/remove-member` — remove a member from a project (Admin only)

### Tasks
- `GET /api/tasks` — get tasks for the current user
- `POST /api/tasks` — create a task (Admin only)
- `PATCH /api/tasks/:id/status` — update task status
- `GET /api/tasks/dashboard/summary` — fetch dashboard statistics

## Usage Guide
1. Create an account via Signup. The first account can be assigned Admin privileges in the backend or via seeded data.
2. Log in to access the dashboard.
3. Admin users can create projects and add members.
4. Admin users can create tasks, assign them to members, and set due dates and priority.
5. Use the Dashboard and Tasks pages to monitor progress and update task status.

## Deployment
- This app is deployed on Render with a working frontend and backend.
- The frontend is configured to call the backend API using the deployed URL.
- CORS is set up to allow requests from both local development and the deployed frontend domain.

## Notes
- Ensure the backend `.env` includes a valid `MONGO_URI` and `JWT_SECRET`.
- The frontend uses `VITE_API_URL` to point at the backend API.
- If deploying again, update the backend URL in `client/.env` and redeploy both services.
