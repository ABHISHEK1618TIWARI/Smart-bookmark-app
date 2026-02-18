@echo off
REM Setup Verification Script for Smart Bookmark App
REM This script checks if everything is set up correctly before running

echo 🔍 Smart Bookmark App - Setup Verification
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js not installed
    echo    Install from: https://nodejs.org
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js installed: %NODE_VERSION%
)

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm not installed
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✅ npm installed: %NPM_VERSION%
)

REM Check node_modules
if not exist "node_modules" (
    echo ❌ Dependencies not installed
    echo    Run: npm install
    exit /b 1
) else (
    echo ✅ Dependencies installed
)

REM Check .env.local
if not exist ".env.local" (
    echo ❌ .env.local not found
    echo    Create with: copy .env.local.example .env.local
    exit /b 1
) else (
    echo ✅ .env.local exists
    
    findstr /M "your-" ".env.local" >nul
    if errorlevel 1 (
        echo ✅ Environment variables appear configured
    ) else (
        echo ⚠️  Environment variables not configured
        echo    Edit .env.local with your Supabase credentials
        exit /b 1
    )
)

REM Check required files
echo.
echo 📁 Checking required files:

if exist "app\page.tsx" (echo    ✅ app\page.tsx) else (echo    ❌ app\page.tsx missing & exit /b 1)
if exist "app\dashboard\page.tsx" (echo    ✅ app\dashboard\page.tsx) else (echo    ❌ app\dashboard\page.tsx missing & exit /b 1)
if exist "app\layout.tsx" (echo    ✅ app\layout.tsx) else (echo    ❌ app\layout.tsx missing & exit /b 1)
if exist "app\globals.css" (echo    ✅ app\globals.css) else (echo    ❌ app\globals.css missing & exit /b 1)
if exist "components\BookmarkForm.tsx" (echo    ✅ components\BookmarkForm.tsx) else (echo    ❌ components\BookmarkForm.tsx missing & exit /b 1)
if exist "components\BookmarkList.tsx" (echo    ✅ components\BookmarkList.tsx) else (echo    ❌ components\BookmarkList.tsx missing & exit /b 1)
if exist "lib\supabaseClient.ts" (echo    ✅ lib\supabaseClient.ts) else (echo    ❌ lib\supabaseClient.ts missing & exit /b 1)
if exist "DATABASE_SCHEMA.sql" (echo    ✅ DATABASE_SCHEMA.sql) else (echo    ❌ DATABASE_SCHEMA.sql missing & exit /b 1)

echo.
echo ==========================================
echo ✅ All checks passed!
echo.
echo Next steps:
echo 1. Configure Supabase credentials in .env.local
echo 2. Run database schema in Supabase SQL Editor
echo 3. Configure Google OAuth in Supabase
echo 4. Run: npm run dev
echo.
