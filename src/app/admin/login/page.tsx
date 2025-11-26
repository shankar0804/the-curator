"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/admin/authService';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const success = authService.login(username, password);

            if (success) {
                router.push('/admin/dashboard');
            } else {
                setError('Invalid username or password');
                setLoading(false);
            }
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    color: '#1a1a1a'
                }}>
                    THE CURATOR
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '2rem',
                    fontSize: '0.9rem'
                }}>
                    Admin Dashboard
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: '#333'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: '#333'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            background: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '6px',
                            color: '#c00',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: loading ? '#999' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#5568d3')}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#667eea')}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#999'
                }}>
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
