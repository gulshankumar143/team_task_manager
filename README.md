# Team Task Manager

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-%23404d59?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-authentication-4b4f56)](https://jwt.io/)
[![Deployed](https://img.shields.io/badge/Deployment-Render-8A2BE2?logo=render&logoColor=white)](https://render.com/)

A full-stack task and project management application with role-based access control, team member assignment, task tracking, and dashboard analytics.

## Project Summary
Team Task Manager enables teams to:
- Register and log in with secure JWT authentication
- Create and manage projects with Admin controls
- Assign tasks to members with due dates and priority
- Track progress using task statuses: `To Do`, `In Progress`, `Done`
- Review project progress and overdue work in a dashboard

## Live Demo
- Frontend: https://team-task-manager-frontend-lt1i.onrender.com/
- Backend API: https://team-task-manager-backend-newu.onrender.com/

## Features
- **Role-based access**: separate Admin and Member permissions
- **Project management**: create projects and invite members
- **Member assignment**: add/remove project members easily
- **Task board**: create tasks and update status by assigned users
- **Task detail view**: click a task card to open task details
- **Dashboard analytics**: totals, status breakdown, overdue tasks, tasks per user
- **Responsive UI**: built with React, Vite, and Tailwind CSS
- **Deployment-ready**: configured for production hosting on Render

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Joi
- Deployment: Render

## Repository Structure
```text
Team Task Manager/
├── client/                 # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
├── server/                 # Express backend API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started
### Backend Setup
```bash
cd server
npm install
```
Create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Start the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```
Open the app in your browser at the Vite URL shown in the terminal.

## API Endpoints
### Auth
- `POST /api/auth/signup` — create a new user account
- `POST /api/auth/login` — log in and return JWT credentials

### Users
- `GET /api/users` — list users (Admin only)

### Projects
- `GET /api/projects` — fetch projects for current user
- `POST /api/projects` — create a project (Admin only)
- `POST /api/projects/:id/add-member` — add member to project (Admin only)
- `POST /api/projects/:id/remove-member` — remove member from project (Admin only)

### Tasks
- `GET /api/tasks` — fetch tasks for current user
- `GET /api/tasks/:id` — fetch a task detail
- `POST /api/tasks` — create task (Admin only)
- `PATCH /api/tasks/:id/status` — update task status
- `GET /api/tasks/dashboard/summary` — dashboard stats

## Usage
1. Sign up or log in.
2. Admin users create projects and add members.
3. Admin users create tasks and assign them to members.
4. Members update task status as work progresses.
5. Use the Dashboard for summary metrics and overdue task visibility.

## Deployment
- This project is deployed on Render.
- The frontend is configured to use the deployed backend API URL.
- Ensure `VITE_API_URL` points to the backend before redeploying the frontend.

## Notes
- Use a valid `MONGO_URI` and `JWT_SECRET` in the backend `.env`.
- Admin permissions are required for project and task creation.
- Assigned users may update their own task status.

---

**Assignment by Ethara.AI**
