import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddFilterModal from '../pages/AddFilterModal';

jest.mock('react-modal', () => {
    const Modal = ({children, isOpen}) => {
        if (!isOpen) return null;
        return <div>{children}</div>;
    };

    Modal.setAppElement = jest.fn();

    return Modal;
});

describe('AddFilterModal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
    });

    test('renders the modal', () => {
        render(<AddFilterModal isOpen={true} onClose={mockOnClose}/>);
        expect(screen.getByText('Add Filter')).toBeInTheDocument();
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByText('+ ADD ROW')).toBeInTheDocument();
    });

    test('adds a new criteria row when "+ ADD ROW" is clicked', () => {
        render(<AddFilterModal isOpen={true} onClose={mockOnClose}/>);
        fireEvent.click(screen.getByText('+ ADD ROW'));
        expect(screen.getAllByText('Criteria:')).toHaveLength(2);
    });

    test('shows error when submitting without criteria values', () => {
        render(<AddFilterModal isOpen={true} onClose={mockOnClose}/>);
        fireEvent.click(screen.getByText('Add'));
        expect(screen.getByText('Please add at least one criterion.')).toBeInTheDocument();
    });
});
