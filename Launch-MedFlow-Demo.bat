@echo off
setlocal enabledelayedexpansion
title MedFlow Presentation Demo Launcher
cd /d "%~dp0"

echo ========================================================================
echo   MedFlow: Integrated B2B Distribution Management Platform
echo   Standalone Presentation Demo (Offline / Zero-Dependency Runtime)
echo ========================================================================
echo.

:: 1. Auto-create Desktop Shortcut if not present
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$WshShell = New-Object -ComObject WScript.Shell; " ^
  "$Desktop = [System.Environment]::GetFolderPath('Desktop'); " ^
  "$ShortcutPath = Join-Path $Desktop 'MedFlow Demo.lnk'; " ^
  "if (-not (Test-Path $ShortcutPath)) { " ^
  "  $Shortcut = $WshShell.CreateShortcut($ShortcutPath); " ^
  "  $Shortcut.TargetPath = '%~dp0Launch-MedFlow-Demo.bat'; " ^
  "  $Shortcut.WorkingDirectory = '%~dp0'; " ^
  "  if (Test-Path '%~dp0medflow.ico') { $Shortcut.IconLocation = '%~dp0medflow.ico,0' }; " ^
  "  $Shortcut.Description = 'MedFlow CBD & Homeopathic Distribution System Demo'; " ^
  "  $Shortcut.Save(); " ^
  "}" >nul 2>nul

:: 2. Verify pre-built static assets exist
if not exist "%~dp0dist\index.html" (
    echo [ERROR] Compiled static client files not found in .\dist.
    if exist "%~dp0package.json" (
        echo [INFO] Building production bundle...
        call npm run build
    ) else (
        echo Please ensure the 'dist' directory is included.
        pause
        exit /b 1
    )
)

:: 3. Start static server (Node.js or native Windows PowerShell)
set APP_PORT=4173
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Starting high-speed demo server via Node.js...
    start "MedFlow Demo Server" /min node "%~dp0server.cjs" %APP_PORT%
) else (
    echo [INFO] Starting zero-dependency Windows server via PowerShell...
    start "MedFlow Demo Server" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port %APP_PORT%
)

:: 4. Brief pause for socket binding
ping -n 2 127.0.0.1 >nul

:: 5. Detect browser and launch in Native Application Mode (--app)
set APP_URL=http://127.0.0.1:%APP_PORT%
set BROWSER_EXE=

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set BROWSER_EXE="C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_EXE="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_EXE="C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) else if exist "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_EXE="%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_EXE="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

if defined BROWSER_EXE (
    echo [INFO] Launching MedFlow in standalone desktop app window...
    start "" %BROWSER_EXE% --app=%APP_URL% --window-size=1440,900
) else (
    echo [INFO] Opening default browser...
    start "" "%APP_URL%"
)

echo.
echo ========================================================================
echo   DEMO LAUNCHED SUCCESSFULLY!
echo ========================================================================
echo   Local URL:       %APP_URL%
echo   Active Role:     Distributor / Owner (Thomas)
echo   Reset Shortcut:  Ctrl + Shift + R (or click 'Reset State' in header)
echo ========================================================================
echo   Leave this console window open while presenting.
echo   Press any key or close this window to stop the server and exit.
echo ========================================================================
echo.
if "%1"=="--test" (
    echo [TEST] Launcher validation complete.
    taskkill /fi "WINDOWTITLE eq MedFlow Demo Server*" /t /f >nul 2>nul
    exit /b 0
)
pause >nul

:: Terminate background server on exit
taskkill /fi "WINDOWTITLE eq MedFlow Demo Server*" /t /f >nul 2>nul
