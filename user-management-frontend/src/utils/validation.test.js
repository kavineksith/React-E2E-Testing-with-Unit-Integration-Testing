import { validation } from './validation';

describe('validation', () => {
    describe('validateName', () => {
        it('should return null for valid name', () => {
            expect(validation.validateName('John Doe')).toBeNull();
            expect(validation.validateName('AB')).toBeNull();
        });

        it('should return error for empty name', () => {
            expect(validation.validateName('')).toBe('Name must be at least 2 characters');
            expect(validation.validateName('   ')).toBe('Name must be at least 2 characters');
        });

        it('should return error for name too short', () => {
            expect(validation.validateName('A')).toBe('Name must be at least 2 characters');
        });

        it('should return error for name too long', () => {
            const longName = 'A'.repeat(51);
            expect(validation.validateName(longName)).toBe('Name cannot exceed 50 characters');
        });

        it('should return error for null/undefined', () => {
            expect(validation.validateName(null)).toBe('Name must be at least 2 characters');
            expect(validation.validateName(undefined)).toBe('Name must be at least 2 characters');
        });
    });

    describe('validateEmail', () => {
        it('should return null for valid email', () => {
            expect(validation.validateEmail('test@example.com')).toBeNull();
            expect(validation.validateEmail('user.name+tag@example.co.uk')).toBeNull();
        });

        it('should return error for invalid email format', () => {
            expect(validation.validateEmail('invalid')).toBe('Please provide a valid email address');
            expect(validation.validateEmail('test@')).toBe('Please provide a valid email address');
            expect(validation.validateEmail('@example.com')).toBe('Please provide a valid email address');
            expect(validation.validateEmail('test@example')).toBe('Please provide a valid email address');
        });

        it('should return error for empty email', () => {
            expect(validation.validateEmail('')).toBe('Please provide a valid email address');
        });

        it('should return error for email too long', () => {
            const longEmail = 'a'.repeat(90) + '@example.com';
            expect(validation.validateEmail(longEmail)).toBe('Email cannot exceed 100 characters');
        });
    });

    describe('validatePassword', () => {
        it('should return null for valid password', () => {
            expect(validation.validatePassword('Password123!')).toBeNull();
            expect(validation.validatePassword('Test@1234')).toBeNull();
        });

        it('should return error for password too short', () => {
            expect(validation.validatePassword('Pass1!')).toBe('Password must be at least 8 characters');
        });

        it('should return error for password without uppercase', () => {
            expect(validation.validatePassword('password123!')).toBe(
                'Password must contain uppercase, lowercase, digit, and special character'
            );
        });

        it('should return error for password without lowercase', () => {
            expect(validation.validatePassword('PASSWORD123!')).toBe(
                'Password must contain uppercase, lowercase, digit, and special character'
            );
        });

        it('should return error for password without digit', () => {
            expect(validation.validatePassword('Password!')).toBe(
                'Password must contain uppercase, lowercase, digit, and special character'
            );
        });

        it('should return error for password without special character', () => {
            expect(validation.validatePassword('Password123')).toBe(
                'Password must contain uppercase, lowercase, digit, and special character'
            );
        });

        it('should return null when password is optional and not provided', () => {
            expect(validation.validatePassword('', false)).toBeNull();
            expect(validation.validatePassword(null, false)).toBeNull();
        });

        it('should return error when password is required and not provided', () => {
            expect(validation.validatePassword('', true)).toBe('Password is required');
        });
    });

    describe('validateForm', () => {
        it('should return no errors for valid create form', () => {
            const formData = {
                name: 'John Doe',
                email: 'john@test.com',
                password: 'Password123!'
            };
            const errors = validation.validateForm(formData, 'create');
            expect(Object.keys(errors)).toHaveLength(0);
        });

        it('should return multiple errors for invalid form', () => {
            const formData = {
                name: 'J',
                email: 'invalid',
                password: 'weak'
            };
            const errors = validation.validateForm(formData, 'create');
            expect(errors.name).toBeDefined();
            expect(errors.email).toBeDefined();
            expect(errors.password).toBeDefined();
        });

        it('should not require password in edit mode if not provided', () => {
            const formData = {
                name: 'John Doe',
                email: 'john@test.com',
                password: ''
            };
            const errors = validation.validateForm(formData, 'edit');
            expect(errors.password).toBeUndefined();
        });
    });
});