import { useState, useEffect } from 'react';
import { getProductRepository } from '@/lib/providerFactory';
import { Product, ProductFilters } from '@/repositories/IProductRepository';

export function useProducts(filters?: ProductFilters, initialData?: Product[]) {
    const [products, setProducts] = useState<Product[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const repo = getProductRepository();

        if (products.length === 0) setLoading(true);

        repo.getAll(filters)
            .then(setProducts)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [JSON.stringify(filters)]); // Re-fetch when filters change

    return { products, loading, error };
}

export function useProductBySlug(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const repo = getProductRepository();

        repo.getBySlug(slug)
            .then(setProduct)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [slug]);

    return { product, loading, error };
}
