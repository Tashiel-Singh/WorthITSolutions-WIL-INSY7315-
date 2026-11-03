@echo off
cd /d "%~dp0"
echo ========================================================================
echo   Creating MedFlow Desktop Shortcut...
echo ========================================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$WshShell = New-Object -ComObject WScript.Shell; " ^
  "$Desktop = [System.Environment]::GetFolderPath('Desktop'); " ^
  "$ShortcutPath = Join-Path $Desktop 'MedFlow Demo.lnk'; " ^
  "$Shortcut = $WshShell.CreateShortcut($ShortcutPath); " ^
  "$Shortcut.TargetPath = '%~dp0Launch-MedFlow-Demo.bat'; " ^
  "$Shortcut.WorkingDirectory = '%~dp0'; " ^
  "if (Test-Path '%~dp0medflow.ico') { $Shortcut.IconLocation = '%~dp0medflow.ico,0' }; " ^
  "$Shortcut.Description = 'MedFlow CBD & Homeopathic Distribution System Standalone Demo'; " ^
  "$Shortcut.Save(); " ^
  "Write-Host '[SUCCESS] Desktop shortcut created at: ' -NoNewline -ForegroundColor Green; " ^
  "Write-Host $ShortcutPath -ForegroundColor Yellow"

echo.
echo You can now launch MedFlow directly from the 'MedFlow Demo' icon on your desktop!
echo.
ping -n 3 127.0.0.1 >nul
