import { supabase } from '@/lib/supabaseClient';

export const imageService = {
    async uploadToSupabase(file: File, bucket: string, path: string): Promise<string> {
        // Upload file
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    },

    async deleteFromSupabase(bucket: string, path: string): Promise<void> {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    },

    // Generate unique filename
    generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const extension = originalName.split('.').pop();
        return `${timestamp}-${random}.${extension}`;
    },

    // Extract path from Supabase URL
    extractPathFromUrl(url: string, bucket: string): string | null {
        try {
            const urlObj = new URL(url);
            const pathMatch = urlObj.pathname.match(new RegExp(`${bucket}/(.+)`));
            return pathMatch ? pathMatch[1] : null;
        } catch {
            return null;
        }
    }
};
