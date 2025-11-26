"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { productService } from '@/services/admin/productService';

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleteId(id);
        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
            alert('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
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
                            Products
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            Manage your inventory
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/products/new')}
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
                        ➕ Add Product
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        Loading products...
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
                                        Title
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Category
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#666' }}>
                                        Price
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
                                {products.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{product.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'monospace' }}>{product.slug}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                background: '#e9ecef',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500'
                                            }}>
                                                {product.categories?.title || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                                            ${(product.price_cents / 100).toFixed(0)}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: product.is_active ? '#d4edda' : '#f8d7da',
                                                color: product.is_active ? '#155724' : '#721c24',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
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
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleteId === product.id}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: deleteId === product.id ? '#999' : '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: deleteId === product.id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {deleteId === product.id ? '...' : '🗑️ Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {products.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                No products found. Click "Add Product" to create one.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
