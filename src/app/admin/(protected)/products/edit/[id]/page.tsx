"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { productService } from '@/services/admin/productService';
import { categoryService } from '@/services/admin/categoryService';
import { imageService } from '@/services/admin/imageService';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '9', '10', '11', '12', 'OS'];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        description: '',
        price_cents: 0,
        category_id: '',
        composition: '',
        fit_description: '',
        is_active: true,
        images: [] as string[],
        sizes: [] as string[]
    });

    useEffect(() => {
        Promise.all([loadProduct(), loadCategories()]);
    }, [productId]);

    async function loadCategories() {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async function loadProduct() {
        try {
            const product = await productService.getById(productId);
            setFormData({
                slug: product.slug,
                title: product.title,
                description: product.description || '',
                price_cents: product.price_cents,
                category_id: product.category_id,
                composition: product.composition || '',
                fit_description: product.fit_description || '',
                is_active: product.is_active,
                images: product.images || [],
                sizes: product.sizes || []
            });
        } catch (error) {
            console.error('Error loading product:', error);
            alert('Failed to load product');
        } finally {
            setFetching(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const newImageUrls = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = imageService.generateFileName(file.name);
                const publicUrl = await imageService.uploadToSupabase(file, 'product-images', fileName);
                newImageUrls.push(publicUrl);
            }

            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
            alert('Images uploaded successfully!');
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await productService.update(productId, {
                ...formData,
                price_cents: Number(formData.price_cents)
            });

            alert('Product updated successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <ProtectedRoute>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading product...
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Edit Product
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        Update product details
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '800px'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
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
                            <div>
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
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Price (in cents) *</label>
                                <input
                                    type="number"
                                    name="price_cents"
                                    value={formData.price_cents}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Category *</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Composition</label>
                                <input
                                    type="text"
                                    name="composition"
                                    value={formData.composition}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Fit Description</label>
                                <input
                                    type="text"
                                    name="fit_description"
                                    value={formData.fit_description}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Available Sizes</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {AVAILABLE_SIZES.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: formData.sizes.includes(size) ? '#667eea' : '#f5f5f5',
                                            color: formData.sizes.includes(size) ? 'white' : '#333',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Product Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploading}
                                style={{ ...inputStyle, padding: '0.5rem' }}
                            />
                            {uploading && (
                                <p style={{ color: '#667eea', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    Uploading images...
                                </p>
                            )}

                            {formData.images.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    {formData.images.map((url, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={url}
                                                alt={`Product ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e0e0e0'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
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
                                {loading ? 'Updating...' : 'Update Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/products')}
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
