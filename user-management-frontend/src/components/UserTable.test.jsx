import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserTable } from './UserTable';

describe('UserTable Component', () => {
    const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@test.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com' }
    ];

    const mockHandlers = {
        onView: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn()
    };

    it('should render loading state', () => {
        render(<UserTable users={[]} loading={true} {...mockHandlers} />);

        expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });

    it('should render empty state when no users', () => {
        render(<UserTable users={[]} loading={false} {...mockHandlers} />);

        expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });

    it('should render users when provided', () => {
        render(<UserTable users={mockUsers} loading={false} {...mockHandlers} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render table headers', () => {
        render(<UserTable users={[]} loading={false} {...mockHandlers} />);

        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });
});