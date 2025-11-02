describe('User Management System - Advanced Tests', () => {
    const API_URL = Cypress.env('apiUrl');

    beforeEach(() => {
        // Setup API intercepts before each test
        cy.intercept('GET', `${API_URL}/all`).as('getAllUsers');
        cy.intercept('POST', `${API_URL}/create`).as('createUser');
        cy.intercept('GET', `${API_URL}/preview*`).as('getUserByEmail');
        cy.intercept('PUT', `${API_URL}/update*`).as('updateUser');
        cy.intercept('DELETE', `${API_URL}/delete*`).as('deleteUser');
    });

    describe('Concurrent Operations', () => {
        it('should handle multiple rapid user creations', () => {
            const users = [
                { name: 'User One', email: 'user1@test.com', password: 'Test@123' },
                { name: 'User Two', email: 'user2@test.com', password: 'Test@123' },
                { name: 'User Three', email: 'user3@test.com', password: 'Test@123' }
            ];

            cy.visit('/');
            cy.wait('@getAllUsers');

            users.forEach((user, index) => {
                cy.openCreateModal();
                cy.fillUserForm(user);
                cy.contains('button', 'Create User').click();
                cy.wait('@createUser');
                cy.wait(1000); // Small delay to avoid race conditions
            });

            // Verify all users are created
            users.forEach(user => {
                cy.verifyUserInTable(user.name, user.email);
            });

            // Cleanup
            users.forEach(user => cy.deleteUser(user.email));
        });

        it('should handle edit and delete operations on same user', () => {
            const user = { name: 'Test User', email: 'test@test.com', password: 'Test@123' };

            cy.createUser(user);
            cy.visit('/');
            cy.wait('@getAllUsers');

            // Edit operation
            cy.openEditModal(user.name);
            cy.fillUserForm({ name: 'Updated User' });
            cy.contains('button', 'Update User').click();
            cy.wait('@updateUser');
            cy.verifySuccessAlert('User updated successfully!');

            // Immediate delete
            cy.on('window:confirm', () => true);
            cy.get('[aria-label="Delete Updated User"]').first().click();
            cy.wait('@deleteUser');
            cy.verifySuccessAlert('User deleted successfully!');
        });
    });

    describe('Form Validation Edge Cases', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.openCreateModal();
        });

        it('should validate name with exactly 2 characters', () => {
            cy.fillUserForm({ name: 'Jo', email: 'jo@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');
            cy.deleteUser('jo@test.com');
        });

        it('should reject name with 51 characters', () => {
            const longName = 'A'.repeat(51);
            cy.fillUserForm({ name: longName, email: 'test@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.contains('Name cannot exceed 50 characters').should('be.visible');
        });

        it('should accept name with exactly 50 characters', () => {
            const maxName = 'A'.repeat(50);
            cy.fillUserForm({ name: maxName, email: 'max@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');
            cy.deleteUser('max@test.com');
        });

        it('should reject email with 101 characters', () => {
            // Create an email with exactly 101 characters
            // We need 101 - 9 (for '@test.com') = 92 characters before the @
            const longEmail = 'a'.repeat(92) + '@test.com';

            // Verify the email is actually 101 characters
            expect(longEmail.length).to.equal(101);

            cy.fillUserForm({ name: 'Test', email: longEmail, password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.contains('Email cannot exceed 100 characters').should('be.visible');
        });

        it('should validate various email formats', () => {
            const invalidEmails = [
                'plaintext',
                '@example.com',
                'user@',
                'user@example'
            ];

            invalidEmails.forEach(email => {
                cy.get('input[name="email"]').clear().type(email);
                cy.get('input[name="name"]').clear().type('Test User');
                cy.get('input[name="password"]').clear().type('Test@123');
                cy.contains('button', 'Create User').click();
                cy.contains('Please provide a valid email address').should('be.visible');
            });
        });

        it('should test all password requirements individually', () => {
            const passwords = [
                { value: 'short', error: 'Password must be at least 8 characters' },
                { value: 'alllowercase123!', error: 'Password must contain uppercase, lowercase, digit, and special character' },
                { value: 'ALLUPPERCASE123!', error: 'Password must contain uppercase, lowercase, digit, and special character' },
                { value: 'NoDigits!@#', error: 'Password must contain uppercase, lowercase, digit, and special character' },
                { value: 'NoSpecial123', error: 'Password must contain uppercase, lowercase, digit, and special character' }
            ];

            passwords.forEach(({ value, error }) => {
                cy.get('input[name="name"]').clear().type('Test User');
                cy.get('input[name="email"]').clear().type('test@test.com');
                cy.get('input[name="password"]').clear().type(value);
                cy.contains('button', 'Create User').click();
                cy.contains(error).should('be.visible');
            });
        });

        it('should accept minimum valid password', () => {
            cy.fillUserForm({ name: 'Test', email: 'min@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');
            cy.deleteUser('min@test.com');
        });
    });

    describe('API Error Handling', () => {
        it('should handle 404 error gracefully', () => {
            cy.intercept('GET', `${API_URL}/all`, {
                statusCode: 404,
                body: { message: 'Endpoint not found' }
            }).as('get404');

            cy.visit('/');
            cy.wait('@get404');
            cy.verifyErrorAlert('Endpoint not found');
        });

        it('should handle 500 server error', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');

            cy.intercept('POST', `${API_URL}/create`, {
                statusCode: 500,
                body: { message: 'Internal server error' }
            }).as('create500');

            cy.openCreateModal();
            cy.fillUserForm({ name: 'Test', email: 'test@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.wait('@create500');
            cy.verifyErrorAlert('Internal server error');
        });

        it('should handle network timeout', () => {
            cy.intercept('GET', `${API_URL}/all`, (req) => {
                req.destroy();
            }).as('networkError');

            cy.visit('/');
            cy.wait('@networkError', { timeout: 10000 });
            // The app should handle the network error gracefully
            cy.get('body').should('be.visible');
        });

        it('should handle malformed response', () => {
            cy.intercept('GET', `${API_URL}/all`, {
                statusCode: 200,
                body: 'invalid json'
            }).as('malformed');

            cy.visit('/');
            cy.wait('@malformed');
            // App should handle this gracefully
            cy.get('body').should('be.visible');
        });
    });

    describe('User Flow Scenarios', () => {
        it('should complete full user lifecycle', () => {
            const user = { name: 'Full Lifecycle', email: 'lifecycle@test.com', password: 'Test@123' };

            cy.visit('/');
            cy.wait('@getAllUsers');

            // 1. Create
            cy.openCreateModal();
            cy.fillUserForm(user);
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');

            // 2. View
            cy.openViewModal(user.name);
            cy.contains(user.name).should('be.visible');
            cy.contains(user.email).should('be.visible');
            cy.closeModal();

            // 3. Edit
            cy.openEditModal(user.name);
            cy.fillUserForm({ name: 'Lifecycle Updated' });
            cy.contains('button', 'Update User').click();
            cy.wait('@updateUser');
            cy.verifySuccessAlert('User updated successfully!');

            // 4. Delete
            cy.on('window:confirm', () => true);
            cy.get('[aria-label="Delete Lifecycle Updated"]').first().click();
            cy.wait('@deleteUser');
            cy.verifySuccessAlert('User deleted successfully!');
            cy.verifyUserNotInTable(user.email);
        });

        it('should handle user canceling operations multiple times', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');

            // Cancel create
            cy.openCreateModal();
            cy.fillUserForm({ name: 'Test', email: 'test@test.com', password: 'Test@123' });
            cy.contains('button', 'Cancel').click();
            cy.contains('Create New User').should('not.exist');

            // Create user for edit test
            cy.createUser({ name: 'Test User', email: 'test@test.com', password: 'Test@123' });
            cy.reload();
            cy.wait('@getAllUsers');

            // Cancel edit
            cy.openEditModal('Test User');
            cy.fillUserForm({ name: 'Should Not Save' });
            cy.contains('button', 'Cancel').click();
            cy.contains('Edit User').should('not.exist');
            cy.contains('Test User').should('be.visible'); // Original name should remain

            // Cancel delete
            cy.on('window:confirm', () => false);
            cy.get('[aria-label="Delete Test User"]').first().click();
            cy.verifyUserInTable('Test User', 'test@test.com');

            // Cleanup
            cy.deleteUser('test@test.com');
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA labels on action buttons', () => {
            cy.createUser({ name: 'ARIA Test', email: 'aria@test.com', password: 'Test@123' });
            cy.visit('/');
            cy.wait('@getAllUsers');

            cy.get('[aria-label="View ARIA Test"]').should('exist');
            cy.get('[aria-label="Edit ARIA Test"]').should('exist');
            cy.get('[aria-label="Delete ARIA Test"]').should('exist');

            cy.deleteUser('aria@test.com');
        });

        it('should have proper ARIA labels on modal close', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.openCreateModal();
            cy.get('[aria-label="Close modal"]').should('exist');
        });

        it('should display validation errors with role="alert"', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.openCreateModal();
            cy.contains('button', 'Create User').click();
            cy.get('[role="alert"]').should('have.length.at.least', 1);
        });

        it('should be keyboard navigable', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.openCreateModal();

            // Tab through form fields
            cy.get('input[name="name"]').focus().type('Test');
            cy.focused().should('have.attr', 'name', 'name');

            cy.get('input[name="email"]').focus().type('test@test.com');
            cy.focused().should('have.attr', 'name', 'email');

            cy.get('input[name="password"]').focus().type('Test@123');
            cy.focused().should('have.attr', 'name', 'password');
        });
    });

    describe('Data Persistence', () => {
        it('should persist user data after page reload', () => {
            const user = { name: 'Persist Test', email: 'persist@test.com', password: 'Test@123' };

            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.openCreateModal();
            cy.fillUserForm(user);
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');

            // Reload page
            cy.reload();
            cy.wait('@getAllUsers');

            // Verify user still exists
            cy.verifyUserInTable(user.name, user.email);

            // Cleanup
            cy.deleteUser(user.email);
        });

        it('should show updated data after external API changes', () => {
            const user = { name: 'External Test', email: 'external@test.com', password: 'Test@123' };

            cy.visit('/');
            cy.wait('@getAllUsers');

            // Create via API
            cy.createUser(user);

            // Reload to see changes
            cy.reload();
            cy.wait('@getAllUsers');
            cy.verifyUserInTable(user.name, user.email);

            // Update via API
            cy.updateUser(user.email, { name: 'External Updated', email: user.email });

            // Reload to see changes
            cy.reload();
            cy.wait('@getAllUsers');
            cy.verifyUserInTable('External Updated', user.email);

            // Cleanup
            cy.deleteUser(user.email);
        });
    });

    describe('Performance Tests', () => {
        it('should handle large number of users', () => {
            const userCount = 20;
            const users = Array.from({ length: userCount }, (_, i) => ({
                name: `User ${i + 1}`,
                email: `user${i + 1}@test.com`,
                password: 'Test@123'
            }));

            // Create users via API (faster than UI)
            users.forEach(user => cy.createUser(user));

            cy.visit('/');
            cy.wait('@getAllUsers');

            // Verify table renders all users
            cy.get('tbody tr').should('have.length.at.least', userCount);

            // Cleanup
            users.forEach(user => cy.deleteUser(user.email));
        });

        it('should load page within acceptable time', () => {
            const startTime = Date.now();

            cy.visit('/');
            cy.wait('@getAllUsers');
            cy.get('table').should('be.visible');

            cy.then(() => {
                const loadTime = Date.now() - startTime;
                expect(loadTime).to.be.lessThan(5000); // Should load in under 5 seconds
            });
        });
    });

    describe('Edge Case Scenarios', () => {
        it('should handle special characters in user name', () => {
            const specialNames = [
                "O'Brien",
                "José García",
                "李明",
                "John-Paul Smith",
                "Anne d'Arc"
            ];

            cy.visit('/');
            cy.wait('@getAllUsers');

            specialNames.forEach((name, index) => {
                const email = `special${index}@test.com`;
                cy.openCreateModal();
                cy.fillUserForm({ name, email, password: 'Test@123' });
                cy.contains('button', 'Create User').click();
                cy.wait('@createUser');
                cy.wait(500);
            });

            // Verify all created
            specialNames.forEach((name) => {
                cy.contains('td', name).should('be.visible');
            });

            // Cleanup
            specialNames.forEach((_, index) => {
                cy.deleteUser(`special${index}@test.com`);
            });
        });

        it('should handle rapid modal open/close', () => {
            cy.visit('/');
            cy.wait('@getAllUsers');

            // Rapidly open and close modal 5 times
            for (let i = 0; i < 5; i++) {
                cy.openCreateModal();
                cy.closeModal();
            }

            // App should still be functional
            cy.openCreateModal();
            cy.fillUserForm({ name: 'Test', email: 'test@test.com', password: 'Test@123' });
            cy.contains('button', 'Create User').click();
            cy.wait('@createUser');
            cy.verifySuccessAlert('User created successfully!');
            cy.deleteUser('test@test.com');
        });
    });
});