@echo off
echo 🚀 TVSHIZ Git Setup Script
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo 📥 Please download and install Git from: https://git-scm.com/download/windows
    echo 🔄 After installation, restart this script.
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

echo 🔧 Initializing Git repository...
git init

echo 📁 Adding all files...
git add .

echo 💾 Creating initial commit...
git commit -m "Initial commit - TVSHIZ streaming dashboard ready for deployment"

echo.
echo ✅ Git repository initialized successfully!
echo.
echo 🌐 Next steps:
echo 1. Go to https://github.com/new
echo 2. Create a new repository named "TVSHIZ"
echo 3. Copy the repository URL
echo 4. Run these commands:
echo.
echo    git remote add origin YOUR_REPO_URL_HERE
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Then go to https://app.netlify.com/ to deploy!
echo.
echo 📋 Don't forget to:
echo    - Get TMDB API key from https://www.themoviedb.org/settings/api
echo    - Add it to Netlify environment variables
echo.
pause
