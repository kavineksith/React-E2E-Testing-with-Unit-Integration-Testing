import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserForm } from './UserForm';

describe('UserForm Component', () => {
    const defaultProps = {
        formData: { name: '', email: '', password: '' },
        formErrors: {},
        mode: 'create',
        loading: false,
        onInputChange: jest.fn(),
        onSubmit: jest.fn(),
        onCancel: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all form fields for create mode', () => {
        render(<UserForm {...defaultProps} />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should disable email field in edit mode', () => {
        render(<UserForm {...defaultProps} mode="edit" />);

        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toBeDisabled();
    });

    it('should call onInputChange when typing in inputs', () => {
        render(<UserForm {...defaultProps} />);

        const nameInput = screen.getByLabelText(/name/i);
        fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });

        expect(defaultProps.onInputChange).toHaveBeenCalled();
    });

    it('should display validation errors', () => {
        const propsWithErrors = {
            ...defaultProps,
            formErrors: {
                name: 'Name is required',
                email: 'Invalid email',
                password: 'Password too weak'
            }
        };

        render(<UserForm {...propsWithErrors} />);

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByText('Password too weak')).toBeInTheDocument();
    });

    it('should call onSubmit when submit button is clicked', () => {
        render(<UserForm {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: /create user/i });
        fireEvent.click(submitButton);

        expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', () => {
        render(<UserForm {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should disable submit button when loading', () => {
        render(<UserForm {...defaultProps} loading={true} />);

        const submitButton = screen.getByRole('button', { name: /processing/i });
        expect(submitButton).toBeDisabled();
    });

    it('should show appropriate button text for create mode', () => {
        render(<UserForm {...defaultProps} mode="create" />);

        expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    it('should show appropriate button text for edit mode', () => {
        render(<UserForm {...defaultProps} mode="edit" />);

        expect(screen.getByRole('button', { name: /update user/i })).toBeInTheDocument();
    });

    it('should show password placeholder for edit mode', () => {
        render(<UserForm {...defaultProps} mode="edit" />);

        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput).toHaveAttribute('placeholder', 'Leave blank to keep current password');
    });
});