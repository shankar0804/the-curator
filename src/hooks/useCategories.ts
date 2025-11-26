import { useState, useEffect } from 'react';
import { getCategoryRepository } from '@/lib/providerFactory';
import { Category } from '@/repositories/ICategoryRepository';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const repo = getCategoryRepository();

        repo.getAll()
            .then(setCategories)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading, error };
}
