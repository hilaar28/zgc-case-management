@echo off
REM ZGC Case Management - Auto Start Script
REM This script starts all services needed for the application

setlocal

REM Configuration - Adjust these paths if needed
set MONGODB_PATH=C:\Program Files\MongoDB\Server\6.0\bin
set MONGODB_DATA_PATH=D:\data\db
set API_PATH=%~dp0api
set XAMPP_PATH=C:\xampp
set PORT=8082

echo ============================================
echo ZGC Case Management - Auto Start
echo ============================================
echo.

REM Check if MongoDB is already running
tasklist /FI "IMAGENAME mongod.exe" 2>NUL | find /I /N "mongod.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is already running
) else (
    echo [1/3] Starting MongoDB...
    if exist "%MONGODB_PATH%\mongod.exe" (
        start "MongoDB" "%MONGODB_PATH%\mongod.exe" --dbpath "%MONGODB_DATA_PATH%" --logpath "%~dp0logs\mongodb.log" --bind_ip 127.0.0.1
        echo MongoDB started (waiting for initialization...)
        ping -n 5 127.0.0.1 >nul
    ) else (
        echo WARNING: MongoDB not found at %MONGODB_PATH%
        echo Please ensure MongoDB is installed or update the MONGODB_PATH in this script
    )
)

REM Check if API is already running
tasklist /FI "IMAGENAME node.exe" 2>NUL | find /I /N "node.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Node.js/API server is already running
) else (
    echo [2/3] Starting API Server...
    start "ZGC API Server" cmd /c "cd /d \"%API_PATH%\" && npm start"
    echo API server started (waiting for initialization...)
    ping -n 10 127.0.0.1 >nul
)

REM Check if Apache is already running
tasklist /FI "IMAGENAME httpd.exe" 2>NUL | find /I /N "httpd.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Apache is already running
) else (
    echo [3/3] Starting Apache...
    if exist "%XAMPP_PATH%\apache\bin\httpd.exe" (
        start "Apache" "%XAMPP_PATH%\apache\bin\httpd.exe"
    ) else (
        echo WARNING: Apache not found at %XAMPP_PATH%
    )
)

echo.
echo ============================================
echo All services started!
echo.
echo Access the application at:
echo   http://localhost:8080
echo.
echo API running at:
echo   http://localhost:%PORT%
echo ============================================

endlocal
