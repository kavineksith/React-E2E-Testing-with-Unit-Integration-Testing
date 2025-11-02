import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserDetailsView } from './UserDetailsView';

describe('UserDetailsView Component', () => {
    const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@test.com'
    };

    it('should render all user details', () => {
        render(<UserDetailsView user={mockUser} />);

        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@test.com')).toBeInTheDocument();
    });

    it('should show password as encrypted', () => {
        render(<UserDetailsView user={mockUser} />);

        expect(screen.getByText(/encrypted \(hidden for security\)/i)).toBeInTheDocument();
    });

    it('should render field labels', () => {
        render(<UserDetailsView user={mockUser} />);

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
    });
});
