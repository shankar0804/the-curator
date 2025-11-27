"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';
import { imageService } from '@/services/admin/imageService';

export default function ImagesPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedBucket, setSelectedBucket] = useState('product-images');

    useEffect(() => {
        loadImages();
    }, [selectedBucket]);

    async function loadImages() {
        setLoading(true);
        try {
            const { data, error } = await supabase.storage
                .from(selectedBucket)
                .list();

            if (error) throw error;

            // Filter out folders (placeholders)
            const files = data?.filter(item => item.id !== null) || [];

            // Add public URL to each file
            const filesWithUrls = files.map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from(selectedBucket)
                    .getPublicUrl(file.name);
                return { ...file, publicUrl };
            });

            setImages(filesWithUrls);
        } catch (error) {
            console.error('Error loading images:', error);
            alert('Failed to load images');
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = imageService.generateFileName(file.name);
                await imageService.uploadToSupabase(file, selectedBucket, fileName);
            }

            alert('Images uploaded successfully!');
            loadImages(); // Refresh list
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await imageService.deleteFromSupabase(selectedBucket, fileName);
            setImages(images.filter(img => img.name !== fileName));
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    return (
        <ProtectedRoute>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            Images
                        </h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            Manage your media library
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select
                            value={selectedBucket}
                            onChange={(e) => setSelectedBucket(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            <option value="product-images">Product Images</option>
                            <option value="category-images">Category Images</option>
                        </select>

                        <label style={{
                            padding: '0.75rem 1.5rem',
                            background: uploading ? '#999' : '#667eea',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                            display: 'inline-block'
                        }}>
                            {uploading ? 'Uploading...' : '📤 Upload Images'}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        Loading images...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {images.map((image) => (
                            <div key={image.id} style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}>
                                <div style={{ height: '200px', position: 'relative', background: '#f5f5f5' }}>
                                    <img
                                        src={image.publicUrl}
                                        alt={image.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: '#333',
                                        marginBottom: '0.5rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {image.name}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => copyUrl(image.publicUrl)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                background: '#e9ecef',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📋 Copy URL
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image.name)}
                                            style={{
                                                padding: '0.5rem',
                                                background: '#fee',
                                                color: '#c00',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {images.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                                No images found in this bucket.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
