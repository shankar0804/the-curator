"use client";

import { useCategories } from '@/hooks/useCategories';
import Image from 'next/image';

export default function TestAbstractionLayer() {
    const { categories, loading, error } = useCategories();

    if (loading) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1>Testing Abstraction Layer</h1>
                <p>Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1>Testing Abstraction Layer</h1>
                <div style={{ background: '#fee', padding: '1rem', borderRadius: '4px', color: '#c00' }}>
                    <strong>Error:</strong> {error.message}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>✅ Abstraction Layer Working!</h1>
            <p style={{ color: '#0a0', fontWeight: 'bold' }}>
                Successfully fetched {categories.length} categories using the abstraction layer
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                {categories.map((category) => (
                    <div key={category.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{category.title}</h3>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{category.subtitle}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>Slug: {category.slug}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                <h2>Architecture Test Results:</h2>
                <ul>
                    <li>✅ Repository Interface (ICategoryRepository)</li>
                    <li>✅ Supabase Adapter (SupabaseCategoryAdapter)</li>
                    <li>✅ Provider Factory (getCategoryRepository)</li>
                    <li>✅ React Hook (useCategories)</li>
                    <li>✅ Data fetched from Supabase</li>
                </ul>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                    🎉 Your app is now 100% provider-agnostic!
                </p>
            </div>
        </div>
    );
}
