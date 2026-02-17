@echo off
REM ZGC Case Management - Add to Windows Startup
REM This script adds the auto-start script to Windows registry

setlocal

REM Get the path where this script is located
set SCRIPT_PATH=%~dp0

echo ============================================
echo ZGC Case Management - Add to Startup
echo ============================================
echo.

REM Add to current user's startup folder
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

REM Copy the VBScript to startup folder
copy "%SCRIPT_PATH%start-silent.vbs" "%STARTUP_FOLDER%\" /Y

if exist "%STARTUP_FOLDER%\start-silent.vbs" (
    echo [OK] Added to startup folder: %STARTUP_FOLDER%
) else (
    echo [ERROR] Failed to add to startup folder
)

REM Also add to registry for all users (requires admin)
echo.
echo Adding to registry (requires admin)...
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v ZGCCaseManagement /t REG_SZ /d "\"%SCRIPT_PATH%start-services.bat\"" /f

if %ERRORLEVEL% equ 0 (
    echo [OK] Added to registry: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
) else (
    echo [WARN] Could not add to registry (admin rights may be required)
    echo.
    echo To add manually:
    echo   1. Press Win + R
    echo   2. Type: regedit
    echo   3. Navigate to: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
    echo   4. Add new String Value:
    echo      Name: ZGCCaseManagement
    echo      Data: "%SCRIPT_PATH%start-services.bat"
)

echo.
echo ============================================
echo Startup configuration complete!
echo.
echo The system will now auto-start when Windows boots.
echo.
echo To test immediately:
echo   - Run: start-services.bat
echo   - Access: http://localhost:8080
echo ============================================

endlocal
