"use client";

import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/admin/authService';

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        authService.logout();
        router.push('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Categories', path: '/admin/categories', icon: '📁' },
        { label: 'Products', path: '/admin/products', icon: '📦' },
        { label: 'Images', path: '/admin/images', icon: '🖼️' },
        { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div style={{
            width: '250px',
            height: '100vh',
            background: '#1a1a1a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            {/* Logo */}
            <div style={{
                padding: '2rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    margin: 0,
                    letterSpacing: '1px'
                }}>
                    THE CURATOR
                </h1>
                <p style={{
                    fontSize: '0.75rem',
                    color: '#999',
                    margin: '0.25rem 0 0 0'
                }}>
                    Admin Dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem 0' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            style={{
                                padding: '0.875rem 1.5rem',
                                cursor: 'pointer',
                                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '600' : '400' }}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{
                padding: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}
