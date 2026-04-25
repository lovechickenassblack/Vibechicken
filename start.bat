@echo off
echo Starting Manga Vibe Checker...
echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo Installing dependencies (this may take a minute)...
call npm install

echo Starting the application...
call npm run dev
pause
