import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Filters from '../pages/Filters';
import axiosInstance from "../axiosConfig";

jest.mock('react-modal', () => {
    const Modal = ({children, isOpen}) => {
        if (!isOpen) return null;
        return <div>{children}</div>;
    };

    Modal.setAppElement = jest.fn();

    return Modal;
});

describe('Filters', () => {

    const mockFilters = [
        {
            id: 1,
            name: 'Filter 1',
            createdDtime: '2024-05-29T00:00:00Z',
            criteria: [
                {id: 1, type: 'Amount', condition: 'Greater than', valueAmount: '100'},
                {id: 2, type: 'Title', condition: 'Starts with', valueTitle: 'Test'},
            ],
        },
    ];

    beforeEach(() => {
        jest.spyOn(axiosInstance, 'get').mockResolvedValueOnce({data: mockFilters});
    });

    test('fetches and displays filters and criteria', async () => {
        render(<Filters/>);
        expect(screen.getByText('Test assignment “Filters”')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Filter 1')).toBeInTheDocument();
            expect(screen.getByText('Criteria')).toBeInTheDocument();
        });
    });

    test('opens and closes modal', () => {
        render(<Filters/>);
        fireEvent.click(screen.getByText('Add Filter In Modal'));
        expect(screen.getByText('Add Filter')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });

    test('opens and closes inline modal', () => {
        render(<Filters/>);
        fireEvent.click(screen.getByText('Add Filter Inline'));
        expect(screen.getByText('Add Filter')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Close Inline Modal'));
        expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    });
});
