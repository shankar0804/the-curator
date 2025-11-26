"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { categoryService } from '@/services/admin/categoryService';
import { imageService } from '@/services/admin/imageService';

export default function NewCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        subtitle: '',
        image_url: '',
        display_order: 0,
        is_active: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = imageService.generateFileName(file.name);
            const publicUrl = await imageService.uploadToSupabase(file, 'category-images', fileName);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await categoryService.create({
                ...formData,
                display_order: parseInt(formData.display_order as any)
            });

            alert('Category created successfully!');
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Add New Category
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        Create a new product category
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '600px'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., SHIRTS"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                placeholder="e.g., The Foundation"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="e.g., shirt (lowercase, no spaces)"
                                style={inputStyle}
                            />
                            <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                Used in URLs. Must be unique and lowercase.
                            </small>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleChange}
                                min="0"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Category Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                style={{
                                    ...inputStyle,
                                    padding: '0.5rem'
                                }}
                            />
                            {uploading && (
                                <p style={{ color: '#667eea', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    Uploading image...
                                </p>
                            )}
                            {formData.image_url && (
                                <div style={{ marginTop: '1rem' }}>
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            borderRadius: '8px',
                                            border: '2px solid #e0e0e0'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Active</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    background: loading || uploading ? '#999' : '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading || uploading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/categories')}
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
};
