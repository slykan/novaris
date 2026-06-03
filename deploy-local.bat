@echo off
setlocal

set NODE="C:\Program Files\nodejs\node.exe"
set NEXT=C:\Users\Korisnik\Desktop\Novaris\novaris-web\node_modules\next\dist\bin\next
set PROJECT=C:\Users\Korisnik\Desktop\Novaris\novaris-web
set WINSCP="C:\Program Files (x86)\WinSCP\WinSCP.com"
set WINSCP_SCRIPT=%PROJECT%\winscp-deploy.txt

echo ==============================
echo  NOVARIS LOCAL DEPLOY
echo ==============================

cd /d %PROJECT%

echo [1/3] Git pull...
git pull

echo [2/3] Building...
%NODE% %NEXT% build
if %errorlevel% neq 0 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo [3/3] Upload na VPS (upisite lozinku)...
%WINSCP% /script="%WINSCP_SCRIPT%"
if %errorlevel% neq 0 (
    echo UPLOAD FAILED!
    pause
    exit /b 1
)

echo.
echo Deploy zavrsen!
pause
