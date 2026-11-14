@echo off
title WTC website
cd /d "%~dp0"
echo.
echo WTC is starting. Leave this window open.
echo This computer:  http://localhost:5173/
echo Same Wi-Fi:     http://192.168.1.18:5173/
echo.
echo Closing this window stops the website.
echo.
"C:\Program Files\nodejs\npm.cmd" run dev
echo.
echo The website stopped.
pause
