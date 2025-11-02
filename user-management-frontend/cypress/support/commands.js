// ***********************************************
// Custom commands for User Management System
// ***********************************************

/**
 * Create a user via API
 * @example cy.createUser({ name: 'John', email: 'john@test.com', password: 'Test@123' })
 */
Cypress.Commands.add('createUser', (userData) => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/create`,
        body: userData,
        failOnStatusCode: false
    });
});

/**
 * Delete a user via API
 * @example cy.deleteUser('john@test.com')
 */
Cypress.Commands.add('deleteUser', (email) => {
    return cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/delete`,
        qs: { email },
        failOnStatusCode: false
    });
});

/**
 * Get all users via API
 * @example cy.getAllUsers()
 */
Cypress.Commands.add('getAllUsers', () => {
    return cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/all`,
        failOnStatusCode: false
    });
});

/**
 * Update a user via API
 * @example cy.updateUser('john@test.com', { name: 'John Updated', email: 'john@test.com' })
 */
Cypress.Commands.add('updateUser', (email, userData) => {
    return cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/update`,
        qs: { email },
        body: userData,
        failOnStatusCode: false
    });
});

/**
 * Clean up all test users - use cautiously!
 * @example cy.cleanupTestUsers(['test1@test.com', 'test2@test.com'])
 */
Cypress.Commands.add('cleanupTestUsers', (emails) => {
    emails.forEach(email => {
        cy.deleteUser(email);
    });
});

/**
 * Fill in the user form
 * @example cy.fillUserForm({ name: 'John', email: 'john@test.com', password: 'Test@123' })
 */
Cypress.Commands.add('fillUserForm', (userData) => {
    if (userData.name !== undefined) {
        cy.get('input[name="name"]').clear().type(userData.name);
    }
    if (userData.email !== undefined) {
        cy.get('input[name="email"]').then($input => {
            if (!$input.is(':disabled')) {
                cy.get('input[name="email"]').clear().type(userData.email);
            }
        });
    }
    if (userData.password !== undefined && userData.password !== '') {
        cy.get('input[name="password"]').clear().type(userData.password);
    }
});

/**
 * Open create user modal
 * @example cy.openCreateModal()
 */
Cypress.Commands.add('openCreateModal', () => {
    cy.contains('button', 'Add User').click();
    cy.contains('Create New User').should('be.visible');
});

/**
 * Open edit modal for a specific user
 * @example cy.openEditModal('John Doe')
 */
Cypress.Commands.add('openEditModal', (userName) => {
    cy.get(`[aria-label="Edit ${userName}"]`).first().click();
    cy.contains('Edit User').should('be.visible');
});

/**
 * Open view modal for a specific user
 * @example cy.openViewModal('John Doe')
 */
Cypress.Commands.add('openViewModal', (userName) => {
    cy.get(`[aria-label="View ${userName}"]`).first().click();
    cy.contains('User Details').should('be.visible');
});

/**
 * Close any open modal
 * @example cy.closeModal()
 */
Cypress.Commands.add('closeModal', () => {
    cy.get('[aria-label="Close modal"]').click();
});

/**
 * Wait for API call to complete
 * @example cy.waitForAPI('getAllUsers')
 */
Cypress.Commands.add('waitForAPI', (alias) => {
    cy.wait(`@${alias}`);
});

/**
 * Verify success alert is displayed
 * @example cy.verifySuccessAlert('User created successfully!')
 */
Cypress.Commands.add('verifySuccessAlert', (message) => {
    cy.contains('Success').should('be.visible');
    cy.contains(message).should('be.visible');
});

/**
 * Verify error alert is displayed
 * @example cy.verifyErrorAlert('Failed to create user')
 */
Cypress.Commands.add('verifyErrorAlert', (message) => {
    cy.contains('Error').should('be.visible');
    if (message) {
        cy.contains(message).should('be.visible');
    }
});

/**
 * Verify user exists in table
 * @example cy.verifyUserInTable('John Doe', 'john@test.com')
 */
Cypress.Commands.add('verifyUserInTable', (name, email) => {
    cy.contains('td', name).should('be.visible');
    cy.contains('td', email).should('be.visible');
});

/**
 * Verify user does not exist in table
 * @example cy.verifyUserNotInTable('john@test.com')
 */
Cypress.Commands.add('verifyUserNotInTable', (email) => {
    cy.contains('td', email).should('not.exist');
});