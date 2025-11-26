import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }

        console.log('✅ Supabase connected successfully!');
        console.log('Sample data:', data);
        return true;
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return false;
    }
}
