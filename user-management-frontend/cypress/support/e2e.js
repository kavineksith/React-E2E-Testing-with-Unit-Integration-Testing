// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log for cleaner output (optional)
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
        '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

// Disable service workers to avoid caching issues during testing
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            registration.unregister();
        });
    });
}

// Global error handler
Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // You can customize this based on specific errors you want to ignore
    if (err.message.includes('ResizeObserver loop')) {
        return false;
    }
    // Let other errors fail the test
    return true;
});