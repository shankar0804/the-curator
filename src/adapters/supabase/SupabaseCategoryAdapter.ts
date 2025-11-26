import { supabase } from '@/lib/supabaseClient';
import { ICategoryRepository, Category } from '@/repositories/ICategoryRepository';

export class SupabaseCategoryAdapter implements ICategoryRepository {
    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            subtitle: row.subtitle || '',
            imageUrl: row.image_url || '',
            displayOrder: row.display_order || 0
        }));
    }

    async getBySlug(slug: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) return null;
        if (!data) return null;

        return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            subtitle: data.subtitle || '',
            imageUrl: data.image_url || '',
            displayOrder: data.display_order || 0
        };
    }
}
