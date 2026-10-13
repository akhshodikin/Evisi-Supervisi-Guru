@echo off
title SIGUR SD - Supervisi Guru Server
cd /d "%~dp0"
set "PATH=%USERPROFILE%\.bun\bin;%PATH%"

echo ========================================================
echo   SIGUR SD - Supervisi Guru (SDN Kandangan I Tosari)
echo   Server sedang berjalan di http://localhost:5173
echo ========================================================
echo.

bun run dev
