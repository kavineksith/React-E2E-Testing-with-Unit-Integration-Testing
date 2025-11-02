import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert } from './Alert';

describe('Alert Component', () => {
    it('should render error alert with correct styling', () => {
        render(<Alert type="error" message="Test error message" onClose={jest.fn()} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should render success alert with correct styling', () => {
        render(<Alert type="success" message="Test success message" onClose={jest.fn()} />);

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('Test success message')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        const onClose = jest.fn();
        render(<Alert type="error" message="Test message" onClose={onClose} />);

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
