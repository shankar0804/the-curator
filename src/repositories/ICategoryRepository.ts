// Category data model
export interface Category {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    displayOrder: number;
}

// Repository interface (contract)
export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    getBySlug(slug: string): Promise<Category | null>;
}
