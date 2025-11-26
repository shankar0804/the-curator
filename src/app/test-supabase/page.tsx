"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestSupabase() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('display_order');

                if (error) throw error;

                setCategories(data || []);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Supabase Connection Test</h1>

            {loading && <p>Loading...</p>}

            {error && (
                <div style={{ background: '#fee', padding: '1rem', borderRadius: '4px', color: '#c00' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {!loading && !error && (
                <div>
                    <p style={{ color: '#0a0', fontWeight: 'bold' }}>
                        ✅ Connected successfully! Found {categories.length} categories.
                    </p>

                    <h2>Categories from Supabase:</h2>
                    <ul>
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <strong>{cat.title}</strong> - {cat.subtitle} (slug: {cat.slug})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
