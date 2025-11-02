import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

describe('Header Component', () => {
    it('should render header with title', () => {
        render(<Header onAddUser={jest.fn()} />);

        expect(screen.getByText('User Management System')).toBeInTheDocument();
    });

    it('should render Add User button', () => {
        render(<Header onAddUser={jest.fn()} />);

        expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    });

    it('should call onAddUser when button is clicked', () => {
        const onAddUser = jest.fn();
        render(<Header onAddUser={onAddUser} />);

        const button = screen.getByRole('button', { name: /add user/i });
        fireEvent.click(button);

        expect(onAddUser).toHaveBeenCalledTimes(1);
    });
});