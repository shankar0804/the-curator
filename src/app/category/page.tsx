import CategoryPage from '@/components/CategoryPage';
import { SupabaseCategoryAdapter } from '@/adapters/supabase/SupabaseCategoryAdapter';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const adapter = new SupabaseCategoryAdapter();
    const categories = await adapter.getAll();

    return <CategoryPage initialCategories={categories} />;
}
