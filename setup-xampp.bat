@echo off
REM ZGC Case Management - XAMPP Setup Script
REM Run this script to prepare the application for XAMPP

echo ============================================
echo ZGC Case Management - XAMPP Setup
echo ============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Installing API dependencies...
cd /d "%~dp0api"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install API dependencies
    pause
    exit /b 1
)

echo [2/5] Installing UI dependencies...
cd /d "%~dp0ui"
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install UI dependencies
    pause
    exit /b 1
)

echo [3/5] Building React UI...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build React UI
    pause
    exit /b 1
)

echo [4/5] Creating Apache configuration...
cd /d "%~dp0xampp-config"
echo Apache config created at: xampp-config/httpd-xampp.conf
echo.
echo IMPORTANT: Copy this file to your XAMPP config:
echo    C:/xampp/apache/conf/extra/httpd-xampp.conf
echo.
echo Then add this line to C:/xampp/apache/conf/httpd.conf:
echo    Include "conf/extra/httpd-xampp.conf"
echo.

echo [5/5] Setup complete!
echo.
echo ============================================
echo NEXT STEPS:
echo ============================================
echo 1. Copy xampp-config/httpd-xampp.conf to:
echo    C:/xampp/apache/conf/extra/httpd-xampp.conf
echo.
echo 2. Add this line to C:/xampp/apache/conf/httpd.conf:
echo    Include "conf/extra/httpd-xampp.conf"
echo.
echo 3. Make sure MongoDB is running
echo.
echo 4. Start the API server:
echo    cd api && npm start
echo.
echo 5. Start Apache from XAMPP Control Panel
echo.
echo 6. Access the application at:
echo    http://localhost:8080
echo.
echo Default login:
echo   Email: admin@zgc.co.zw
echo   Password: 1234
echo ============================================

pause
