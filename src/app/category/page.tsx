import CategoryPage from '@/components/CategoryPage';
import { SupabaseCategoryAdapter } from '@/adapters/supabase/SupabaseCategoryAdapter';

export const revalidate = 3600;

export default async function Page() {
    const adapter = new SupabaseCategoryAdapter();
    const categories = await adapter.getAll();

    return <CategoryPage initialCategories={categories} />;
}
