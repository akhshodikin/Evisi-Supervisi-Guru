@echo off
title Hentikan Server SIGUR SD
echo Menghentikan server SIGUR SD pada port 5173...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Menghentikan proses PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Server telah berhasil dihentikan.
pause
