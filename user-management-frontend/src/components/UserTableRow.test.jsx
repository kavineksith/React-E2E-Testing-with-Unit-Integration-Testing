import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserTableRow } from './UserTableRow';

describe('UserTableRow Component', () => {
    const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@test.com'
    };

    const mockHandlers = {
        onView: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render user data correctly', () => {
        render(
            <table>
                <tbody>
                    <UserTableRow user={mockUser} {...mockHandlers} />
                </tbody>
            </table>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@test.com')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should call onView when view button is clicked', () => {
        render(
            <table>
                <tbody>
                    <UserTableRow user={mockUser} {...mockHandlers} />
                </tbody>
            </table>
        );

        const viewButton = screen.getByLabelText('View John Doe');
        fireEvent.click(viewButton);

        expect(mockHandlers.onView).toHaveBeenCalledWith('john@test.com');
    });

    it('should call onEdit when edit button is clicked', () => {
        render(
            <table>
                <tbody>
                    <UserTableRow user={mockUser} {...mockHandlers} />
                </tbody>
            </table>
        );

        const editButton = screen.getByLabelText('Edit John Doe');
        fireEvent.click(editButton);

        expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockUser);
    });

    it('should call onDelete when delete button is clicked', () => {
        render(
            <table>
                <tbody>
                    <UserTableRow user={mockUser} {...mockHandlers} />
                </tbody>
            </table>
        );

        const deleteButton = screen.getByLabelText('Delete John Doe');
        fireEvent.click(deleteButton);

        expect(mockHandlers.onDelete).toHaveBeenCalledWith('john@test.com');
    });
});