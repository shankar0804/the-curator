import { supabase } from '@/lib/supabaseClient';
import { IProductRepository, Product, ProductFilters } from '@/repositories/IProductRepository';

export class SupabaseProductAdapter implements IProductRepository {
    async getAll(filters?: ProductFilters): Promise<Product[]> {
        let query = supabase
            .from('products')
            .select(`
        *,
        product_images(image_url, display_order),
        product_sizes(size)
      `)
            .eq('is_active', true);

        // Apply filters
        if (filters?.categoryIds && filters.categoryIds.length > 0) {
            query = query.in('category_id', filters.categoryIds);
        }

        if (filters?.minPrice !== undefined) {
            query = query.gte('price_cents', filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
            query = query.lte('price_cents', filters.maxPrice);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data || []).map(row => this.mapToProduct(row));
    }

    async getBySlug(slug: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        product_images(image_url, display_order),
        product_sizes(size),
        product_suggestions!source_product_id(
          suggested_product:products!suggested_product_id(
            *,
            product_images(image_url, display_order)
          )
        )
      `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching product by slug:', slug, JSON.stringify(error, null, 2));
            return null;
        }
        if (!data) return null;

        const product = this.mapToProduct(data);

        // Debug log
        console.log('Fetched suggestions raw:', JSON.stringify(data.product_suggestions, null, 2));

        // Map suggestions
        if (data.product_suggestions && Array.isArray(data.product_suggestions)) {
            product.suggestedProducts = data.product_suggestions
                .map((item: any) => item.suggested_product)
                .filter((p: any) => p && p.is_active !== false) // Ensure product exists and is active
                .map((p: any) => this.mapToProduct(p));
        } else {
            product.suggestedProducts = [];
        }

        return product;
    }

    async getByCategoryId(categoryId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        product_images(image_url, display_order),
        product_sizes(size)
      `)
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error) throw error;

        return (data || []).map(row => this.mapToProduct(row));
    }

    private mapToProduct(row: any): Product {
        // Sort images by display_order
        const images = (row.product_images || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url);

        // Extract unique sizes
        const sizes = (row.product_sizes || [])
            .map((s: any) => s.size)
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            description: row.description || '',
            priceCents: row.price_cents,
            displayPrice: `$${(row.price_cents / 100).toFixed(0)}`,
            categoryId: row.category_id,
            composition: row.composition || '',
            fitDescription: row.fit_description || '',
            images,
            sizes,
            externalUrl: row.external_url || ''
        };
    }
}
