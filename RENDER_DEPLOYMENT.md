# Render Deployment Guide (Free Tier Available)

## Backend Deployment

1. **Create Render Account**: Go to https://render.com and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Set service name: `team-task-manager-backend`
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://newgulshandps09_db_user:ZOksxSDIxLuJxJxdrw@cluster0.nhzqr3d.mongodb.net/team-task-manager
   JWT_SECRET=your_secure_jwt_secret_here_12345
   PORT=10000
   ```

5. **Deploy**: Click "Create Web Service"

## Frontend Deployment

1. **Create Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repo
   - Set site name: `team-task-manager-frontend`
   - Branch: `main`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

3. **Deploy**: Click "Create Static Site"

## Getting the URLs

After deployment:
- Backend URL: `https://team-task-manager-backend.onrender.com`
- Frontend URL: `https://team-task-manager-frontend.onrender.com`

Update the frontend environment variable with the actual backend URL.

## Free Tier Limits (Render)
- 750 hours/month
- 100GB bandwidth/month
- No credit card required for free tier

Your app will be publicly accessible once deployed!