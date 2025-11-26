import { useState, useEffect } from 'react';
import { getCategoryRepository } from '@/lib/providerFactory';
import { Category } from '@/repositories/ICategoryRepository';

export function useCategories(initialData?: Category[]) {
    const [categories, setCategories] = useState<Category[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const repo = getCategoryRepository();

        if (categories.length === 0) setLoading(true);

        repo.getAll()
            .then(setCategories)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading, error };
}
