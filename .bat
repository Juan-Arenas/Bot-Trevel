@echo off
echo.
echo ==============================
echo        GESTOR DE TREVEL BOT 
echo ==============================
echo.

echo 1 - Iniciar bot
echo 2 - Reiniciar bot
echo 3 - Detener bot
echo 4 - Ver logs
echo 5 - Salir
echo.

set /p opcion=Selecciona una opcion: 

if "%opcion%"=="1" pm2 start index.js --name "TrevelBot"
if "%opcion%"=="2" pm2 restart TrevelBot
if "%opcion%"=="3" pm2 stop TrevelBot
if "%opcion%"=="4" pm2 logs TrevelBot
if "%opcion%"=="5" exit

pause
