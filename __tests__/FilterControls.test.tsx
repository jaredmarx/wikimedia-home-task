// __tests__/FilterControls.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this is imported
import FilterControls from '../src/components/FilterControls';
import { Filters } from '../src/utils/type';

const mockFilters: Filters = {
    domain: '',
    namespace: '',
    user: ''
};

describe('FilterControls', () => {
    test('renders filter controls correctly', () => {
        render(<FilterControls filters={mockFilters} onFilterChange={() => {}} />);

        expect(screen.getByPlaceholderText('Domain')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Namespace')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('User')).toBeInTheDocument();
    });

    test('calls onFilterChange when filter is changed', () => {
        const onFilterChangeMock = jest.fn();
        render(<FilterControls filters={mockFilters} onFilterChange={onFilterChangeMock} />);

        fireEvent.change(screen.getByPlaceholderText('Domain'), { target: { value: 'en.wikipedia.org' } });
        expect(onFilterChangeMock).toHaveBeenCalledWith({ ...mockFilters, domain: 'en.wikipedia.org' });

        fireEvent.change(screen.getByPlaceholderText('Namespace'), { target: { value: '0' } });
        expect(onFilterChangeMock).toHaveBeenCalledWith({ ...mockFilters, namespace: '0' });

        fireEvent.change(screen.getByPlaceholderText('User'), { target: { value: 'SampleUser' } });
        expect(onFilterChangeMock).toHaveBeenCalledWith({ ...mockFilters, user: 'SampleUser' });
    });
});
