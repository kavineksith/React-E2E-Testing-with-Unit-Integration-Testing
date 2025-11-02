@echo off
echo.
echo 🚀 Setting up Cypress for Vite Project...
echo.

REM Step 1: Install dependencies
echo 📦 Installing Cypress and dependencies...
call npm install --save-dev cypress start-server-and-test

REM Step 2: Initialize Cypress
echo.
echo 🔧 Initializing Cypress...
call npx cypress install

REM Step 3: Create directory structure
echo.
echo 📁 Creating directory structure...
if not exist "cypress\e2e" mkdir cypress\e2e
if not exist "cypress\support" mkdir cypress\support
if not exist "cypress\fixtures" mkdir cypress\fixtures

REM Step 4: Remove example files
echo.
echo 🧹 Cleaning up example files...
if exist "cypress\e2e\1-getting-started" rmdir /s /q cypress\e2e\1-getting-started
if exist "cypress\e2e\2-advanced-examples" rmdir /s /q cypress\e2e\2-advanced-examples
if exist "cypress\fixtures\example.json" del /q cypress\fixtures\example.json

REM Step 5: Create cypress.config.js
echo.
echo ⚙️  Creating cypress.config.js...
(
echo const { defineConfig } = require('cypress'^);
echo.
echo module.exports = defineConfig({
echo   e2e: {
echo     baseUrl: 'http://localhost:5173',
echo     setupNodeEvents(on, config^) {
echo       // implement node event listeners here
echo     },
echo     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
echo     supportFile: 'cypress/support/e2e.js',
echo     viewportWidth: 1280,
echo     viewportHeight: 720,
echo     video: true,
echo     screenshotOnRunFailure: true,
echo     defaultCommandTimeout: 10000,
echo     requestTimeout: 10000,
echo     responseTimeout: 10000,
echo     chromeWebSecurity: false,
echo     env: {
echo       apiUrl: 'http://localhost:8080/users'
echo     }
echo   },
echo }^);
) > cypress.config.js

REM Step 6: Create support/e2e.js
echo.
echo 📝 Creating support/e2e.js...
(
echo // Import commands
echo import './commands';
echo.
echo // Hide fetch/XHR requests from command log
echo const app = window.top;
echo if (^^!app.document.head.querySelector('[data-hide-command-log-request]'^)^) {
echo   const style = app.document.createElement('style'^);
echo   style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
echo   style.setAttribute('data-hide-command-log-request', ''^^);
echo   app.document.head.appendChild(style^);
echo }
echo.
echo // Disable service workers
echo if ('serviceWorker' in navigator^) {
echo   navigator.serviceWorker.getRegistrations(^^).then((registrations^) =^> {
echo     registrations.forEach((registration^) =^> {
echo       registration.unregister(^^);
echo     }^);
echo   }^);
echo }
echo.
echo // Global error handler
echo Cypress.on('uncaught:exception', (err, runnable^) =^> {
echo   if (err.message.includes('ResizeObserver loop'^)^) {
echo     return false;
echo   }
echo   return true;
echo }^);
) > cypress\support\e2e.js

REM Step 7: Create verification test
echo.
echo 🧪 Creating verification test...
(
echo describe('Setup Verification', (^^) =^> {
echo   it('should load the application', (^^) =^> {
echo     cy.visit('/'^);
echo     cy.get('body'^).should('be.visible'^);
echo   }^);
echo.
echo   it('should have the correct title', (^^) =^> {
echo     cy.visit('/'^);
echo     cy.contains('User Management System'^).should('be.visible'^);
echo   }^);
echo }^);
) > cypress\e2e\setup-verification.cy.js

REM Step 8: Update .gitignore
echo.
echo 📄 Updating .gitignore...
if exist .gitignore (
    findstr /C:"cypress/videos" .gitignore >nul
    if errorlevel 1 (
        echo. >> .gitignore
        echo # Cypress >> .gitignore
        echo cypress/videos >> .gitignore
        echo cypress/screenshots >> .gitignore
        echo cypress/downloads >> .gitignore
        echo cypress.env.json >> .gitignore
    )
) else (
    (
        echo # Cypress
        echo cypress/videos
        echo cypress/screenshots
        echo cypress/downloads
        echo cypress.env.json
    ) > .gitignore
)

echo.
echo ✅ Cypress setup complete!
echo.
echo 📚 Next steps:
echo 1. Copy your test files to cypress\e2e\
echo 2. Copy custom commands to cypress\support\commands.js
echo 3. Run 'npm run dev' to start your Vite server
echo 4. Run 'npm run cypress:open' to open Cypress Test Runner
echo.
echo 🎉 Happy testing!
echo.
pause