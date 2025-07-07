@echo off
echo 🚀 Preparing TVSHIZ for Netlify deployment...
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  No .env file found. Please create one based on .env.example
    echo 📄 Copy .env.example to .env and add your API keys:
    echo    - TMDB_API_KEY ^(required for movie/TV data^)
    echo    - OPENAI_API_KEY ^(optional for AI features^)
    pause
    exit /b 1
)

REM Build the project
echo 📦 Building the project...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🎯 Next steps for Netlify deployment:
    echo 1. Go to https://app.netlify.com/
    echo 2. Click 'New site from Git'
    echo 3. Choose your repository
    echo 4. Netlify will automatically detect the configuration
    echo 5. Add your environment variables in Site settings ^> Environment variables:
    echo    - TMDB_API_KEY
    echo    - OPENAI_API_KEY ^(if using AI features^)
    echo 6. Deploy!
    echo.
    echo 📋 Environment variables to set in Netlify:
    echo    TMDB_API_KEY: Get from https://www.themoviedb.org/settings/api
    echo    OPENAI_API_KEY: Get from https://platform.openai.com/api-keys
) else (
    echo ❌ Build failed. Please fix the errors above.
    pause
    exit /b 1
)

pause
