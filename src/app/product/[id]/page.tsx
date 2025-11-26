import ProductDetailPage from '@/components/ProductDetailPage';
import { SupabaseProductAdapter } from '@/adapters/supabase/SupabaseProductAdapter';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const adapter = new SupabaseProductAdapter();
    const product = await adapter.getBySlug(id);

    return <ProductDetailPage initialProduct={product} />;
}
