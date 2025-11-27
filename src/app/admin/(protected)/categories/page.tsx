"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { categoryService } from '@/services/admin/categoryService';
import { revalidateCategoryPage } from '@/app/actions/revalidate';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this category?')) return;

        setDeleteId(id);
        try {
            await categoryService.delete(id);
            setCategories(categories.filter(c => c.id !== id));
            await revalidateCategoryPage();
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        } finally {
            setDeleteId(null);
        }
    }

    return (
        <ProtectedRoute>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            Categories
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            Manage your product categories
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/categories/new')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
                    >
                        ➕ Add Category
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        Loading categories...
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Order
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Title
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Subtitle
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Slug
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Status
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                            {category.display_order}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                                            {category.title}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                            {category.subtitle}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontFamily: 'monospace', color: '#667eea' }}>
                                            {category.slug}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: category.is_active ? '#d4edda' : '#f8d7da',
                                                color: category.is_active ? '#155724' : '#721c24',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    marginRight: '0.5rem'
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                disabled={deleteId === category.id}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: deleteId === category.id ? '#999' : '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: deleteId === category.id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {deleteId === category.id ? '...' : '🗑️ Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {categories.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                No categories found. Click "Add Category" to create one.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
