describe('User Management System E2E Tests', () => {
    // No need to define BASE_URL - Cypress uses baseUrl from cypress.config.js
    const API_URL = 'http://localhost:8080/users';

    // Test data
    const testUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Test@123'
    };

    const updatedUser = {
        name: 'John Updated',
        email: 'john.doe@example.com',
        password: 'NewPass@123'
    };

    beforeEach(() => {
        // Intercept API calls
        cy.intercept('GET', `${API_URL}/all`).as('getAllUsers');
        cy.intercept('POST', `${API_URL}/create`).as('createUser');
        cy.intercept('GET', `${API_URL}/preview*`).as('getUserByEmail');
        cy.intercept('PUT', `${API_URL}/update*`).as('updateUser');
        cy.intercept('DELETE', `${API_URL}/delete*`).as('deleteUser');

        // Use cy.visit('/') - it will use baseUrl from cypress.config.js
        cy.visit('/');
        cy.wait('@getAllUsers');
    });

    describe('Initial Page Load', () => {
        it('should display the header with title and Add User button', () => {
            cy.contains('User Management System').should('be.visible');
            cy.contains('button', 'Add User').should('be.visible');
        });

        it('should display the user table', () => {
            cy.get('table').should('be.visible');
            cy.contains('th', 'Name').should('be.visible');
            cy.contains('th', 'Email').should('be.visible');
            cy.contains('th', 'ID').should('be.visible');
            cy.contains('th', 'Actions').should('be.visible');
        });
    });

    describe('Create User', () => {
        it('should open create modal when Add User button is clicked', () => {
            cy.contains('button', 'Add User').click();
            cy.contains('Create New User').should('be.visible');
            cy.get('input[name="name"]').should('be.visible');
            cy.get('input[name="email"]').should('be.visible');
            cy.get('input[name="password"]').should('be.visible');
        });

        it('should close modal when Cancel button is clicked', () => {
            cy.contains('button', 'Add User').click();
            cy.contains('button', 'Cancel').click();
            cy.contains('Create New User').should('not.exist');
        });

        it('should close modal when X button is clicked', () => {
            cy.contains('button', 'Add User').click();
            cy.get('[aria-label="Close modal"]').click();
            cy.contains('Create New User').should('not.exist');
        });

        it('should show validation errors for empty fields', () => {
            cy.contains('button', 'Add User').click();
            cy.contains('button', 'Create User').click();

            cy.contains('Name must be at least 2 characters').should('be.visible');
            cy.contains('Please provide a valid email address').should('be.visible');
            cy.contains('Password is required').should('be.visible');
        });

        it('should show validation error for short name', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type('A');
            cy.contains('button', 'Create User').click();
            cy.contains('Name must be at least 2 characters').should('be.visible');
        });

        it('should show validation error for invalid email', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="email"]').type('invalid-email');
            cy.contains('button', 'Create User').click();
            cy.contains('Please provide a valid email address').should('be.visible');
        });

        it('should show validation error for weak password', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="password"]').type('weak');
            cy.contains('button', 'Create User').click();
            cy.contains('Password must be at least 8 characters').should('be.visible');
        });

        it('should show validation error for password without special character', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="password"]').type('Test1234');
            cy.contains('button', 'Create User').click();
            cy.contains('Password must contain uppercase, lowercase, digit, and special character').should('be.visible');
        });

        it('should successfully create a new user', () => {
            cy.contains('button', 'Add User').click();

            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);

            cy.contains('button', 'Create User').click();

            cy.wait('@createUser').its('response.statusCode').should('eq', 201);
            cy.wait('@getAllUsers');

            cy.contains('User created successfully!').should('be.visible');
            cy.contains('Create New User').should('not.exist');
            cy.contains(testUser.name).should('be.visible');
            cy.contains(testUser.email).should('be.visible');
        });

        it('should show error when creating duplicate user', () => {
            // First create a user
            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');

            // Try to create the same user again
            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();

            cy.wait('@createUser');
            cy.contains('Error').should('be.visible');
        });
    });

    describe('View User', () => {
        beforeEach(() => {
            // Create a user before each test
            cy.request('POST', `${API_URL}/create`, testUser);
            cy.reload();
            cy.wait('@getAllUsers');
        });

        it('should open view modal when eye icon is clicked', () => {
            cy.get('[aria-label="View John Doe"]').first().click();
            cy.wait('@getUserByEmail');

            cy.contains('User Details').should('be.visible');
            cy.contains('label', 'ID').should('be.visible');
            cy.contains('label', 'Name').should('be.visible');
            cy.contains('label', 'Email').should('be.visible');
            cy.contains('label', 'Password').should('be.visible');
            cy.contains('Encrypted (hidden for security)').should('be.visible');
        });

        it('should display correct user information in view modal', () => {
            cy.get('[aria-label="View John Doe"]').first().click();
            cy.wait('@getUserByEmail');

            cy.contains(testUser.name).should('be.visible');
            cy.contains(testUser.email).should('be.visible');
        });

        it('should close view modal when X button is clicked', () => {
            cy.get('[aria-label="View John Doe"]').first().click();
            cy.wait('@getUserByEmail');
            cy.get('[aria-label="Close modal"]').click();
            cy.contains('User Details').should('not.exist');
        });
    });

    describe('Update User', () => {
        beforeEach(() => {
            // Create a user before each test
            cy.request('POST', `${API_URL}/create`, testUser);
            cy.reload();
            cy.wait('@getAllUsers');
        });

        it('should open edit modal when edit icon is clicked', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.contains('Edit User').should('be.visible');
            cy.get('input[name="name"]').should('have.value', testUser.name);
            cy.get('input[name="email"]').should('have.value', testUser.email);
            cy.get('input[name="email"]').should('be.disabled');
            cy.contains('Email cannot be changed').should('be.visible');
        });

        it('should successfully update user name', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.get('input[name="name"]').clear().type(updatedUser.name);
            cy.contains('button', 'Update User').click();

            cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
            cy.wait('@getAllUsers');

            cy.contains('User updated successfully!').should('be.visible');
            cy.contains(updatedUser.name).should('be.visible');
        });

        it('should successfully update user password', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.get('input[name="password"]').type(updatedUser.password);
            cy.contains('button', 'Update User').click();

            cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
            cy.contains('User updated successfully!').should('be.visible');
        });

        it('should update user without changing password', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.get('input[name="name"]').clear().type(updatedUser.name);
            // Leave password empty
            cy.contains('button', 'Update User').click();

            cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
            cy.contains('User updated successfully!').should('be.visible');
        });

        it('should show validation error when updating with invalid data', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.get('input[name="name"]').clear().type('A');
            cy.contains('button', 'Update User').click();

            cy.contains('Name must be at least 2 characters').should('be.visible');
        });

        it('should show validation error for weak password when updating', () => {
            cy.get('[aria-label="Edit John Doe"]').first().click();

            cy.get('input[name="password"]').type('weak');
            cy.contains('button', 'Update User').click();

            // Check for partial text instead of exact match
            cy.get('body').should('contain', 'Password must');
        });
    });

    describe('Delete User', () => {
        beforeEach(() => {
            // Create a user before each test
            cy.request('POST', `${API_URL}/create`, testUser);
            cy.reload();
            cy.wait('@getAllUsers');
        });

        it('should show confirmation dialog when delete icon is clicked', () => {
            cy.on('window:confirm', (text) => {
                expect(text).to.contains(`Are you sure you want to delete user with email: ${testUser.email}?`);
                return false; // Cancel deletion
            });

            cy.get('[aria-label="Delete John Doe"]').first().click();
        });

        it('should not delete user when confirmation is cancelled', () => {
            cy.on('window:confirm', () => false);

            cy.get('[aria-label="Delete John Doe"]').first().click();

            cy.contains(testUser.name).should('be.visible');
        });

        it('should successfully delete user when confirmed', () => {
            cy.on('window:confirm', () => true);

            cy.get('[aria-label="Delete John Doe"]').first().click();

            cy.wait('@deleteUser').its('response.statusCode').should('eq', 204);
            cy.wait('@getAllUsers');

            cy.contains('User deleted successfully!').should('be.visible');
            cy.contains(testUser.email).should('not.exist');
        });
    });

    describe('Alert Messages', () => {
        it('should auto-dismiss success alert after 5 seconds', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();

            cy.wait('@createUser');
            cy.contains('User created successfully!').should('be.visible');

            cy.wait(5000);
            cy.contains('User created successfully!').should('not.exist');
        });

        it('should manually close success alert', () => {
            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();

            cy.wait('@createUser');
            cy.contains('User created successfully!').should('be.visible');

            // Click X button on alert
            cy.contains('User created successfully!')
                .parent()
                .parent()
                .find('button')
                .click();

            cy.contains('User created successfully!').should('not.exist');
        });
    });

    describe('Empty State', () => {
        it('should show empty state message when no users exist', () => {
            cy.intercept('GET', `${API_URL}/all`, { body: { data: [] } }).as('getEmptyUsers');
            cy.reload();
            cy.wait('@getEmptyUsers');

            cy.contains('No users found. Click Add User to create one.').should('be.visible');
        });
    });

    describe('Loading States', () => {
        it('should show loading state while fetching users', () => {
            cy.intercept('GET', `${API_URL}/all`, (req) => {
                req.reply({
                    delay: 1000,
                    statusCode: 200,
                    body: { data: [] }
                });
            }).as('getSlowUsers');

            cy.reload();
            cy.contains('Loading users...').should('be.visible');
        });

        it('should disable submit button while processing', () => {
            cy.intercept('POST', `${API_URL}/create`, (req) => {
                req.reply({
                    delay: 1000,
                    statusCode: 201,
                    body: { data: {} }
                });
            }).as('slowCreate');

            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();

            cy.contains('button', 'Processing...').should('be.disabled');
        });
    });

    describe('Error Handling', () => {
        it('should display error message when API fails', () => {
            cy.intercept('POST', `${API_URL}/create`, {
                statusCode: 500,
                body: { message: 'Server error occurred' }
            }).as('createError');

            cy.contains('button', 'Add User').click();
            cy.get('input[name="name"]').type(testUser.name);
            cy.get('input[name="email"]').type(testUser.email);
            cy.get('input[name="password"]').type(testUser.password);
            cy.contains('button', 'Create User').click();

            cy.wait('@createError');
            cy.contains('Error').should('be.visible');
            cy.contains('Server error occurred').should('be.visible');
        });
    });

    describe('Responsive Design', () => {
        it('should be usable on mobile viewport', () => {
            cy.viewport('iphone-x');

            cy.contains('User Management System').should('be.visible');
            cy.contains('button', 'Add User').should('be.visible');
            cy.get('table').should('be.visible');
        });

        it('should be usable on tablet viewport', () => {
            cy.viewport('ipad-2');

            cy.contains('User Management System').should('be.visible');
            cy.contains('button', 'Add User').should('be.visible');
            cy.get('table').should('be.visible');
        });
    });

    afterEach(() => {
        // Cleanup: Delete test user if it exists
        cy.request({
            method: 'DELETE',
            url: `${API_URL}/delete?email=${testUser.email}`,
            failOnStatusCode: false
        });
    });
});