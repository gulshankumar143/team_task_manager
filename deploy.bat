@echo off
echo 🚀 Deploying Team Task Manager to Railway
echo.

cd /d "%~dp0"

echo 📋 Checking Railway authentication...
railway whoami
if %errorlevel% neq 0 (
    echo ❌ Not authenticated with Railway.
    echo Please run: railway login --browserless
    echo Then visit https://railway.com/activate with the provided code
    pause
    exit /b 1
)

echo ✅ Railway authenticated
echo.

echo 🏗️  Deploying Backend...
cd server
railway up
if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Backend deployed
echo.

echo 🎨 Deploying Frontend...
cd ../client
railway up
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend deployed
echo.

echo 🔧 Setting up environment variables...
echo.
echo IMPORTANT: Set these environment variables in Railway dashboard:
echo.
echo Backend Service:
echo - MONGO_URI = mongodb+srv://your-connection-string
echo - JWT_SECRET = your-secure-jwt-secret
echo.
echo Frontend Service:
echo - VITE_API_URL = https://your-backend-service-url.railway.app/api
echo.

echo 🎉 Deployment complete!
echo Visit your Railway dashboard to get the URLs and set environment variables.
pause