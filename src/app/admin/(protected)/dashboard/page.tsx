"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        categories: 0,
        products: 0,
        images: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [categoriesRes, productsRes, imagesRes] = await Promise.all([
                    supabase.from('categories').select('id', { count: 'exact', head: true }),
                    supabase.from('products').select('id', { count: 'exact', head: true }),
                    supabase.from('product_images').select('id', { count: 'exact', head: true })
                ]);

                setStats({
                    categories: categoriesRes.count || 0,
                    products: productsRes.count || 0,
                    images: imagesRes.count || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    return (
        <ProtectedRoute>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Welcome back, Shankar! Here's your overview.
                </p>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    <StatCard
                        title="Categories"
                        value={loading ? '...' : stats.categories}
                        icon="📁"
                        color="#667eea"
                    />
                    <StatCard
                        title="Products"
                        value={loading ? '...' : stats.products}
                        icon="📦"
                        color="#28a745"
                    />
                    <StatCard
                        title="Images"
                        value={loading ? '...' : stats.images}
                        icon="🖼️"
                        color="#ffc107"
                    />
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <QuickActionButton href="/admin/categories" label="Add Category" icon="➕" />
                        <QuickActionButton href="/admin/products" label="Add Product" icon="📦" />
                        <QuickActionButton href="/admin/images" label="Upload Image" icon="📤" />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${color}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                        {title}
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                        {value}
                    </p>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.3 }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function QuickActionButton({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <a
            href={href}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </a>
    );
}
