@echo off
echo 🚀 TVSHIZ Git Setup for Repository: https://github.com/bettingbentm/tvshiz.git
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo 📥 Please install Git first:
    echo 1. Go to: https://git-scm.com/download/windows
    echo 2. Download Git for Windows
    echo 3. Install with default settings
    echo 4. Restart your terminal/VS Code
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

echo 🔧 Initializing Git repository...
git init

echo 📁 Adding all files to Git...
git add .

echo 💾 Creating initial commit...
git commit -m "Initial commit - TVSHIZ streaming dashboard ready for deployment"

echo 🌐 Connecting to your GitHub repository...
git remote add origin https://github.com/bettingbentm/tvshiz.git

echo 📤 Setting main branch and pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your code is now on GitHub!
    echo.
    echo 🚀 Next Steps for Netlify Deployment:
    echo.
    echo 1. Go to: https://app.netlify.com/
    echo 2. Click "New site from Git"
    echo 3. Choose "GitHub"
    echo 4. Select repository: "bettingbentm/tvshiz"
    echo 5. Netlify will auto-detect build settings from netlify.toml
    echo 6. Add environment variable:
    echo    - Name: TMDB_API_KEY
    echo    - Value: [Get from https://www.themoviedb.org/settings/api]
    echo 7. Click "Deploy site"
    echo.
    echo 🎉 Your TVSHIZ dashboard will be live in minutes!
) else (
    echo.
    echo ❌ Push failed. This might be because:
    echo 1. Repository already has content
    echo 2. Authentication needed
    echo.
    echo 🔄 Try these commands manually:
    echo    git remote add origin https://github.com/bettingbentm/tvshiz.git
    echo    git branch -M main
    echo    git push -u origin main
)

echo.
pause
