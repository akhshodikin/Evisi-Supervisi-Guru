@echo off
title E-VISI GURU - Deploy ke Google Firebase Hosting
cd /d "%~dp0"
set "PATH=%USERPROFILE%\.bun\bin;%PATH%"

echo ========================================================
echo   E-VISI GURU: Deploy ke Google Firebase Hosting
echo   Target Site: evisi-supervisi-guru
echo   SDN Kandangan I & II Tosari (Alur GROW Coaching)
echo ========================================================
echo.

echo [1/3] Memeriksa akun Google Firebase...
call bun x firebase login
if %errorlevel% neq 0 (
  echo Terjadi kendala saat login ke Firebase.
  pause
  exit /b %errorlevel%
)

echo.
echo [2/3] Membangun bundle web produksi (Vite build)...
call bun run build
if %errorlevel% neq 0 (
  echo Build gagal, periksa kode program Anda.
  pause
  exit /b %errorlevel%
)

echo.
echo [3/3] Mengunggah ke Google Firebase Hosting (evisi-supervisi-guru)...
call bun x firebase deploy --only hosting

echo.
echo ========================================================
echo   Aplikasi E-VISI GURU Berhasil Online di Firebase!
echo   Buka: https://evisi-supervisi-guru.web.app
echo   Alias: https://evisi-supervisi-guru.firebaseapp.com
echo ========================================================
echo.
pause
