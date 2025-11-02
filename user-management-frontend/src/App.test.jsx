import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { userService } from './services/userService';

// Mock the userService
jest.mock('./services/userService');

describe('App Component - Integration Tests', () => {
    const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@test.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        userService.getAllUsers.mockResolvedValue({ data: mockUsers });
    });

    it('should fetch and display users on mount', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should display error message when fetch fails', async () => {
        userService.getAllUsers.mockRejectedValue({
            response: { data: { message: 'Network error' } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    it('should open create modal when Add User button is clicked', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const addButton = screen.getByRole('button', { name: /add user/i });
        fireEvent.click(addButton);

        expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('should create a new user successfully', async () => {
        userService.createUser.mockResolvedValue({ data: null });
        userService.getAllUsers.mockResolvedValue({ data: [...mockUsers, { id: '3', name: 'New User', email: 'new@test.com' }] });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        // Open create modal
        fireEvent.click(screen.getByRole('button', { name: /add user/i }));

        // Fill form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { name: 'name', value: 'New User' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { name: 'email', value: 'new@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { name: 'password', value: 'Password123!' }
        });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /create user/i }));

        await waitFor(() => {
            expect(userService.createUser).toHaveBeenCalledWith({
                name: 'New User',
                email: 'new@test.com',
                password: 'Password123!'
            });
        });

        await waitFor(() => {
            expect(screen.getByText('User created successfully!')).toBeInTheDocument();
        });
    });

    it('should open edit modal when edit button is clicked', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const editButton = screen.getByLabelText('Edit John Doe');
        fireEvent.click(editButton);

        expect(screen.getByText('Edit User')).toBeInTheDocument();
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    it('should update user successfully', async () => {
        userService.updateUser.mockResolvedValue({ data: null });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        // Open edit modal
        fireEvent.click(screen.getByLabelText('Edit John Doe'));

        // Update name
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { name: 'name', value: 'John Updated' }
        });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /update user/i }));

        await waitFor(() => {
            expect(userService.updateUser).toHaveBeenCalledWith('john@test.com', {
                name: 'John Updated',
                email: 'john@test.com'
            });
        });

        await waitFor(() => {
            expect(screen.getByText('User updated successfully!')).toBeInTheDocument();
        });
    });

    it('should open view modal when view button is clicked', async () => {
        const userDetail = { id: '1', name: 'John Doe', email: 'john@test.com' };
        userService.getUserByEmail.mockResolvedValue({ data: userDetail });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const viewButton = screen.getByLabelText('View John Doe');
        fireEvent.click(viewButton);

        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
        });
    });

    it('should delete user after confirmation', async () => {
        window.confirm = jest.fn(() => true);
        userService.deleteUser.mockResolvedValue({ data: null });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('Delete John Doe');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(userService.deleteUser).toHaveBeenCalledWith('john@test.com');
        });

        await waitFor(() => {
            expect(screen.getByText('User deleted successfully!')).toBeInTheDocument();
        });
    });

    it('should not delete user if confirmation is cancelled', async () => {
        window.confirm = jest.fn(() => false);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('Delete John Doe');
        fireEvent.click(deleteButton);

        expect(userService.deleteUser).not.toHaveBeenCalled();
    });

    it('should auto-dismiss success message after 5 seconds', async () => {
        jest.useFakeTimers();
        userService.deleteUser.mockResolvedValue({ data: null });
        window.confirm = jest.fn(() => true);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByLabelText('Delete John Doe'));

        await waitFor(() => {
            expect(screen.getByText('User deleted successfully!')).toBeInTheDocument();
        });

        jest.advanceTimersByTime(5000);

        await waitFor(() => {
            expect(screen.queryByText('User deleted successfully!')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    it('should handle empty user list', async () => {
        userService.getAllUsers.mockResolvedValue({ data: [] });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/no users found/i)).toBeInTheDocument();
        });
    });

    it('should close modal when cancel is clicked', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /add user/i }));
        expect(screen.getByText('Create New User')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        await waitFor(() => {
            expect(screen.queryByText('Create New User')).not.toBeInTheDocument();
        });
    });
});