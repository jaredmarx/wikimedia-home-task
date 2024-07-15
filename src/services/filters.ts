export const saveFilters = (filters: Record<string, string>) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('filters', JSON.stringify(filters));
    }
};

export const loadFilters = (): Record<string, string> => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const filters = localStorage.getItem('filters');
        try {
            return filters ? JSON.parse(filters) : { domain: '', namespace: '', user: '' };
        } catch (e) {
            console.error('Error parsing filters from localStorage', e);
            return { domain: '', namespace: '', user: '' }; // Default filters if JSON.parse fails
        }
    }
    return { domain: '', namespace: '', user: '' }; // Default filters if localStorage is not available

};

