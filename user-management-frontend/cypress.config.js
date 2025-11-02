const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // ⚠️ IMPORTANT: Your Vite server runs on port 5137
    baseUrl: 'http://localhost:5137',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // Test file location pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Support file with custom commands
    supportFile: 'cypress/support/e2e.js',

    // Browser viewport size
    viewportWidth: 1280,
    viewportHeight: 720,

    // Recording settings
    video: true,
    screenshotOnRunFailure: true,

    // Timeout settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    // Disable CORS restrictions for testing
    chromeWebSecurity: false,

    // Environment variables accessible via Cypress.env()
    env: {
      apiUrl: 'http://localhost:8080/users'
    }
  },
});