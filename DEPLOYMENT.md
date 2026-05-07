# Railway Deployment Guide

This repo contains a full-stack app with:
- `server/` backend (Express + MongoDB)
- `client/` frontend (React + Vite)

## Setup

1. Login to Railway:
   ```bash
   railway login
   ```

2. Create a new Railway project or link to an existing one:
   ```bash
   railway init
   ```

## Backend deployment

From `server/`:

```bash
cd server
railway up
```

### Required environment variables

Set these in Railway for the backend service:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional)

## Frontend deployment

From `client/`:

```bash
cd client
railway up
```

### Required environment variables

Set this for the frontend service:
- `VITE_API_URL=https://<backend-service-domain>/api`

## Notes

- The frontend already reads `VITE_API_URL` in `client/src/api/axios.js`.
- Do not commit `.env` files to source control.
- Use the Railway dashboard or CLI to add and manage env vars.
