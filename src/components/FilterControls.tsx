"use client";

import React, { ChangeEvent } from 'react';
import styles from './FilterControls.module.css';
import { Filters } from '../utils/type';

interface FilterControlsProps {
    filters: Filters;
    onFilterChange: (filter: Filters) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className={styles.filterControls}>
            <input
                type="text"
                name="domain"
                value={filters.domain}
                placeholder="Domain"
                onChange={handleChange}
            />
            <input
                type="text"
                name="namespace"
                value={filters.namespace}
                placeholder="Namespace"
                onChange={handleChange}
            />
            <input
                type="text"
                name="user"
                value={filters.user}
                placeholder="User"
                onChange={handleChange}
            />
        </div>
    );
};

export default FilterControls;
