import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserModal } from './UserModal';

describe('UserModal Component', () => {
    const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@test.com'
    };

    const defaultProps = {
        mode: 'create',
        user: null,
        onClose: jest.fn(),
        onSubmit: jest.fn(),
        loading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render create modal with correct title', () => {
        render(<UserModal {...defaultProps} />);

        expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('should render edit modal with correct title', () => {
        render(<UserModal {...defaultProps} mode="edit" user={mockUser} />);

        expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    it('should render view modal with correct title', () => {
        render(<UserModal {...defaultProps} mode="view" user={mockUser} />);

        expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(<UserModal {...defaultProps} />);

        const closeButton = screen.getByLabelText('Close modal');
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should display user details in view mode', () => {
        render(<UserModal {...defaultProps} mode="view" user={mockUser} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@test.com')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should validate form on submit', async () => {
        render(<UserModal {...defaultProps} mode="create" />);

        const submitButton = screen.getByRole('button', { name: /create user/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
        });
    });

    it('should call onSubmit with valid data', async () => {
        render(<UserModal {...defaultProps} mode="create" />);

        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { name: 'name', value: 'John Doe' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { name: 'email', value: 'john@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { name: 'password', value: 'Password123!' }
        });

        const submitButton = screen.getByRole('button', { name: /create user/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@test.com',
                password: 'Password123!'
            });
        });
    });

    it('should pre-fill form data in edit mode', () => {
        render(<UserModal {...defaultProps} mode="edit" user={mockUser} />);

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@test.com')).toBeInTheDocument();
    });

    it('should clear validation errors when typing', async () => {
        render(<UserModal {...defaultProps} mode="create" />);

        // Trigger validation error
        const submitButton = screen.getByRole('button', { name: /create user/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
        });

        // Type to clear error
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { name: 'name', value: 'John Doe' }
        });

        await waitFor(() => {
            expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
        });
    });
});