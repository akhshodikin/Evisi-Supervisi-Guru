@echo off
title E-VISI GURU - Deploy ke Google Firebase Hosting
cd /d "%~dp0"
set "PATH=%USERPROFILE%\.bun\bin;%PATH%"

echo ========================================================
echo   E-VISI GURU: Deploy ke Google Firebase Hosting
echo   SDN Kandangan I & II Tosari (Alur GROW Coaching)
echo ========================================================
echo.

echo [1/3] Memeriksa akun Firebase...
call bun x firebase login:list
if %errorlevel% neq 0 (
  echo.
  echo Anda belum login ke Firebase CLI.
  echo Membuka browser untuk login dengan Akun Google...
  call bun x firebase login
)

echo.
echo [2/3] Membangun bundle web produksi (Vite build)...
call bun run build

echo.
echo [3/3] Mengunggah ke Google Firebase Hosting...
call bun x firebase deploy --only hosting

echo.
echo ========================================================
echo   Aplikasi E-VISI GURU Berhasil Online di Firebase!
echo ========================================================
pause
