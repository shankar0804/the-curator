"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { categoryService } from '@/services/admin/categoryService';
import { imageService } from '@/services/admin/imageService';
import { revalidateCategoryPage } from '@/app/actions/revalidate';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        subtitle: '',
        image_url: '',
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    async function loadCategory() {
        try {
            const category = await categoryService.getById(categoryId);
            setFormData({
                slug: category.slug,
                title: category.title,
                subtitle: category.subtitle || '',
                image_url: category.image_url || '',
                display_order: category.display_order,
                is_active: category.is_active
            });
        } catch (error) {
            console.error('Error loading category:', error);
            alert('Failed to load category');
        } finally {
            setFetching(false);
        }
    }

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
            // Delete old image if it exists and is from Supabase storage
            if (formData.image_url && formData.image_url.includes('supabase.co/storage')) {
                try {
                    const oldPath = imageService.extractPathFromUrl(formData.image_url, 'category-images');
                    if (oldPath) {
                        await imageService.deleteFromSupabase('category-images', oldPath);
                    }
                } catch (err) {
                    console.warn('Could not delete old image:', err);
                }
            }

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

    const handleRemoveImage = async () => {
        if (!confirm('Are you sure you want to remove this image?')) return;

        try {
            // Delete from storage if it's a Supabase URL
            if (formData.image_url && formData.image_url.includes('supabase.co/storage')) {
                const path = imageService.extractPathFromUrl(formData.image_url, 'category-images');
                if (path) {
                    await imageService.deleteFromSupabase('category-images', path);
                }
            }

            setFormData(prev => ({ ...prev, image_url: '' }));
        } catch (error) {
            console.error('Error removing image:', error);
            alert('Failed to remove image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await categoryService.update(categoryId, {
                ...formData,
                display_order: parseInt(formData.display_order as any)
            });

            await revalidateCategoryPage();
            alert('Category updated successfully!');
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <ProtectedRoute>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading category...
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Edit Category
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        Update category details
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
                                style={inputStyle}
                            />
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
                                style={{ ...inputStyle, padding: '0.5rem' }}
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
                                            border: '2px solid #e0e0e0',
                                            display: 'block',
                                            marginBottom: '0.5rem'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️ Remove Image
                                    </button>
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
                                    background: loading || uploading ? '#999' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading || uploading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Updating...' : 'Update Category'}
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
    outline: 'none'
};
