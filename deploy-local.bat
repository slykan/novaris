@echo off
setlocal

set PLINK="C:\Program Files\PuTTY\plink.exe"
set PROJECT=C:\Users\Korisnik\Desktop\Novaris\novaris-web

echo ==============================
echo  NOVARIS DEPLOY
echo ==============================

cd /d %PROJECT%

echo [1/2] Git push...
git push origin main
if %errorlevel% neq 0 (
    echo GIT PUSH FAILED!
    pause
    exit /b 1
)

echo [2/2] SSH deploy na VPS...
%PLINK% novaris@vps.on-click.hr "bash ~/deploy.sh"
if %errorlevel% neq 0 (
    echo DEPLOY FAILED!
    pause
    exit /b 1
)

echo.
echo Deploy zavrsen!
pause
