import { ICategoryRepository } from '@/repositories/ICategoryRepository';
import { IProductRepository } from '@/repositories/IProductRepository';

// Supabase Adapters
import { SupabaseCategoryAdapter } from '@/adapters/supabase/SupabaseCategoryAdapter';
import { SupabaseProductAdapter } from '@/adapters/supabase/SupabaseProductAdapter';

// Single source of truth: Change this to switch providers
const ACTIVE_PROVIDER = process.env.NEXT_PUBLIC_DATA_PROVIDER || 'supabase';

export function getCategoryRepository(): ICategoryRepository {
    switch (ACTIVE_PROVIDER) {
        case 'supabase':
            return new SupabaseCategoryAdapter();
        // Future providers can be added here:
        // case 'firebase':
        //   return new FirebaseCategoryAdapter();
        // case 'rest-api':
        //   return new RestApiCategoryAdapter();
        default:
            throw new Error(`Unknown provider: ${ACTIVE_PROVIDER}`);
    }
}

export function getProductRepository(): IProductRepository {
    switch (ACTIVE_PROVIDER) {
        case 'supabase':
            return new SupabaseProductAdapter();
        // Future providers can be added here:
        // case 'firebase':
        //   return new FirebaseProductAdapter();
        // case 'rest-api':
        //   return new RestApiProductAdapter();
        default:
            throw new Error(`Unknown provider: ${ACTIVE_PROVIDER}`);
    }
}
