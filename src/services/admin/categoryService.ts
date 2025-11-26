import { supabase } from '@/lib/supabaseClient';

export interface CategoryFormData {
    slug: string;
    title: string;
    subtitle: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

export const categoryService = {
    async getAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order');

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(category: CategoryFormData) {
        const { data, error } = await supabase
            .from('categories')
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, category: Partial<CategoryFormData>) {
        const { data, error } = await supabase
            .from('categories')
            .update(category)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        // First, get the category to find its image URL
        const category = await this.getById(id);

        // Delete the image from storage if it exists and is from Supabase
        if (category.image_url && category.image_url.includes('supabase.co/storage')) {
            try {
                const { imageService } = await import('./imageService');
                const path = imageService.extractPathFromUrl(category.image_url, 'category-images');
                if (path) {
                    await imageService.deleteFromSupabase('category-images', path);
                }
            } catch (err) {
                console.warn('Could not delete category image:', err);
            }
        }

        // Delete the category from database
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
