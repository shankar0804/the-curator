import ProductListingPage from '@/components/ProductListingPage';
import { SupabaseProductAdapter } from '@/adapters/supabase/SupabaseProductAdapter';
import { SupabaseCategoryAdapter } from '@/adapters/supabase/SupabaseCategoryAdapter';
import { Product } from '@/repositories/IProductRepository';

// Force dynamic rendering because we are using params and fetching data that might change
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;

    const categoryAdapter = new SupabaseCategoryAdapter();
    const productAdapter = new SupabaseProductAdapter();

    // 1. Fetch all categories
    const categories = await categoryAdapter.getAll();

    // 2. Resolve category ID from slug
    let initialProducts: Product[] = [];

    if (categoryId && categoryId !== 'all') {
        const category = categories.find(c => c.slug === categoryId);
        if (category) {
            // Fetch products for this category
            initialProducts = await productAdapter.getAll({ categoryIds: [category.id] });
        } else {
            // Category not found? Return empty.
            initialProducts = [];
        }
    } else {
        // 'all' or undefined -> fetch all
        initialProducts = await productAdapter.getAll();
    }

    return (
        <ProductListingPage
            initialCategories={categories}
            initialProducts={initialProducts}
        />
    );
}
