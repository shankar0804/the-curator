// Product data model
export interface Product {
    id: string;
    slug: string;
    title: string;
    description: string;
    priceCents: number;
    displayPrice: string;
    categoryId: string;
    composition: string;
    fitDescription: string;
    images: string[];
    sizes: string[];
    externalUrl?: string;
}

// Filter options
export interface ProductFilters {
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
}

// Repository interface (contract)
export interface IProductRepository {
    getAll(filters?: ProductFilters): Promise<Product[]>;
    getBySlug(slug: string): Promise<Product | null>;
    getByCategoryId(categoryId: string): Promise<Product[]>;
}
