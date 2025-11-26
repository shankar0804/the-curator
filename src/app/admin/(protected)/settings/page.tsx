"use client";

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function SettingsPage() {
    const [provider, setProvider] = useState('supabase');

    useEffect(() => {
        // Load saved provider from localStorage or env (simulated)
        const saved = localStorage.getItem('admin_storage_provider') || 'supabase';
        setProvider(saved);
    }, []);

    const handleSave = () => {
        localStorage.setItem('admin_storage_provider', provider);
        alert('Settings saved successfully!');
    };

    return (
        <ProtectedRoute>
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Settings
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        Configure your dashboard preferences
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '600px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Storage Configuration
                    </h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500' }}>
                            Default Storage Provider
                        </label>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                border: `2px solid ${provider === 'supabase' ? '#667eea' : '#e0e0e0'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: provider === 'supabase' ? '#f0f4ff' : 'white'
                            }}>
                                <input
                                    type="radio"
                                    name="provider"
                                    value="supabase"
                                    checked={provider === 'supabase'}
                                    onChange={(e) => setProvider(e.target.value)}
                                    style={{ marginRight: '1rem' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Supabase Storage</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        Default storage. Free tier includes 1GB storage and 2GB bandwidth.
                                    </div>
                                </div>
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                border: `2px solid ${provider === 'cloudflare' ? '#667eea' : '#e0e0e0'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: provider === 'cloudflare' ? '#f0f4ff' : 'white'
                            }}>
                                <input
                                    type="radio"
                                    name="provider"
                                    value="cloudflare"
                                    checked={provider === 'cloudflare'}
                                    onChange={(e) => setProvider(e.target.value)}
                                    style={{ marginRight: '1rem' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Cloudflare R2 (Coming Soon)</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        High-performance storage with free bandwidth. Requires API configuration.
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        style={{
                            padding: '0.875rem 2rem',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
