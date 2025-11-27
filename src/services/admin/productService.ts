import { supabase } from '@/lib/supabaseClient';

export interface ProductFormData {
    slug: string;
    title: string;
    description: string;
    price_cents: number;
    category_id: string;
    composition: string;
    fit_description: string;
    is_active: boolean;
    images: string[]; // Array of image URLs
    sizes: string[];  // Array of size strings
    external_url?: string; // External store URL
}

export const productService = {
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        categories (title)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        // Fetch product details
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (productError) throw productError;

        // Fetch images
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('image_url, display_order')
            .eq('product_id', id)
            .order('display_order');

        if (imagesError) throw imagesError;

        // Fetch sizes
        const { data: sizes, error: sizesError } = await supabase
            .from('product_sizes')
            .select('size')
            .eq('product_id', id)
            .eq('is_available', true);

        if (sizesError) throw sizesError;

        return {
            ...product,
            images: images?.map(img => img.image_url) || [],
            sizes: sizes?.map(s => s.size) || []
        };
    },

    async create(productData: ProductFormData) {
        // 1. Insert product
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert([{
                slug: productData.slug,
                title: productData.title,
                description: productData.description,
                price_cents: productData.price_cents,
                category_id: productData.category_id,
                composition: productData.composition,
                fit_description: productData.fit_description,
                is_active: productData.is_active,
                external_url: productData.external_url || null
            }])
            .select()
            .single();

        const productId = product.id;

        // 2. Insert images
        if (productData.images.length > 0) {
            const imageInserts = productData.images.map((url, index) => ({
                product_id: productId,
                image_url: url,
                display_order: index + 1
            }));

            const { error: imageError } = await supabase
                .from('product_images')
                .insert(imageInserts);

            if (imageError) throw imageError;
        }

        // 3. Insert sizes
        if (productData.sizes.length > 0) {
            const sizeInserts = productData.sizes.map(size => ({
                product_id: productId,
                size: size,
                is_available: true
            }));

            const { error: sizeError } = await supabase
                .from('product_sizes')
                .insert(sizeInserts);

            if (sizeError) throw sizeError;
        }

        return product;
    },

    async update(id: string, productData: ProductFormData) {
        // 1. Update product fields
        const { error: productError } = await supabase
            .from('products')
            .update({
                slug: productData.slug,
                title: productData.title,
                description: productData.description,
                price_cents: productData.price_cents,
                category_id: productData.category_id,
                composition: productData.composition,
                fit_description: productData.fit_description,
                is_active: productData.is_active,
                external_url: productData.external_url || null
            })
            .eq('id', id);

        if (productError) throw productError;



        // 3. Update sizes (Delete all and re-insert)
        await supabase.from('product_sizes').delete().eq('product_id', id);

        if (productData.sizes.length > 0) {
            const sizeInserts = productData.sizes.map(size => ({
                product_id: id,
                size: size,
                is_available: true
            }));

            const { error: sizeError } = await supabase
                .from('product_sizes')
                .insert(sizeInserts);

            if (sizeError) throw sizeError;
        }
    },

    async delete(id: string) {
        // First, get all product images to delete from storage
        const { data: productImages } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', id);

        // Delete images from storage
        if (productImages && productImages.length > 0) {
            const { imageService } = await import('./imageService');
            for (const img of productImages) {
                if (img.image_url && img.image_url.includes('supabase.co/storage')) {
                    try {
                        const path = imageService.extractPathFromUrl(img.image_url, 'product-images');
                        if (path) {
                            await imageService.deleteFromSupabase('product-images', path);
                        }
                    } catch (err) {
                        console.warn('Could not delete product image:', err);
                    }
                }
            }
        }

        // Delete related data from database
        await supabase.from('product_images').delete().eq('product_id', id);
        await supabase.from('product_sizes').delete().eq('product_id', id);

        // Delete the product
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
