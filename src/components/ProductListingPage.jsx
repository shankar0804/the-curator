"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '30', '32', '34', '36', '9', '10', '11', 'OS'];

const PRICE_RANGES = [
    { id: 'all', label: 'All Prices', min: 0, max: 10000000 },
    { id: 'under-300', label: 'Under $300', min: 0, max: 30000 },
    { id: '300-600', label: '$300 - $600', min: 30000, max: 60000 },
    { id: 'over-600', label: 'Over $600', min: 60000, max: 10000000 },
];

const ProductListingPage = ({ initialProducts, initialCategories }) => {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.categoryId;

    // --- STATE ---
    // Initialize directly from URL to prevent flash of "all products"
    const [selectedCategories, setSelectedCategories] = useState(() => {
        if (categoryId && categoryId !== 'all') {
            console.log('Initializing category from URL:', categoryId);
            return [categoryId];
        }
        return [];
    });
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // --- FETCH DATA ---
    const { categories, loading: categoriesLoading } = useCategories(initialCategories);

    // Build filters for products
    const productFilters = useMemo(() => {
        let categoryIdsArray = undefined;

        if (selectedCategories.length > 0) {
            // Map selected slugs to IDs
            const ids = categories
                .filter(c => selectedCategories.includes(c.slug))
                .map(c => c.id);

            // If categories are selected but we found no matching IDs:
            // 1. If categories haven't loaded yet (categories.length === 0), we want to wait (don't show all products).
            // 2. If categories loaded but no match found, we want to show no results.
            // In both cases, passing a dummy ID ensures we don't fall back to "fetch all".
            if (ids.length === 0) {
                categoryIdsArray = ['waiting-for-ids'];
            } else {
                categoryIdsArray = ids;
            }
        }

        return {
            categoryIds: categoryIdsArray,
            minPrice: selectedPriceRange.min,
            maxPrice: selectedPriceRange.max,
        };
    }, [selectedCategories, selectedPriceRange, categories]);

    const { products, loading: productsLoading } = useProducts(productFilters, initialProducts);

    // Client-side size filtering (since Supabase query doesn't handle this)
    const filteredProducts = useMemo(() => {
        if (selectedSizes.length === 0) return products;
        return products.filter(product =>
            product.sizes.some(size => selectedSizes.includes(size))
        );
    }, [products, selectedSizes]);

    const loading = categoriesLoading || productsLoading;

    // Convert categories to options format
    const CATEGORY_OPTIONS = useMemo(() =>
        categories.map(cat => ({ id: cat.slug, label: cat.title })),
        [categories]
    );

    // --- INITIALIZATION ---
    useEffect(() => {
        // Sync with URL changes (e.g. back button)
        if (categoryId && categoryId !== 'all') {
            if (!selectedCategories.includes(categoryId)) {
                console.log('Syncing category from URL:', categoryId);
                setSelectedCategories([categoryId]);
            }
        } else if (selectedCategories.length > 0 && (!categoryId || categoryId === 'all')) {
            console.log('Clearing category filter from URL change');
            setSelectedCategories([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // --- HANDLERS ---
    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    // --- COMPONENTS ---
    const FilterContent = () => (
        <div className="v3-filters">
            {/* Categories */}
            <div className="v3-filter-group">
                <h4 className="v3-filter-title">Category</h4>
                <div className="v3-checkbox-group">
                    {CATEGORY_OPTIONS.map(opt => (
                        <label key={opt.id} className="v3-checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(opt.id)}
                                onChange={() => toggleCategory(opt.id)}
                            />
                            <span className="v3-checkmark"></span>
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="v3-filter-group">
                <h4 className="v3-filter-title">Price</h4>
                <div className="v3-radio-group">
                    {PRICE_RANGES.map(range => (
                        <label key={range.id} className="v3-radio-label">
                            <input
                                type="radio"
                                name="price"
                                checked={selectedPriceRange.id === range.id}
                                onChange={() => setSelectedPriceRange(range)}
                            />
                            <span className="v3-radio-custom"></span>
                            {range.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="v3-filter-group">
                <h4 className="v3-filter-title">Size</h4>
                <div className="v3-size-grid">
                    {SIZE_OPTIONS.map(size => (
                        <button
                            key={size}
                            className={`v3-size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                            onClick={() => toggleSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="v3-container">
            {/* HEADER */}
            <header className="v3-header">
                <div className="v3-brand" onClick={() => router.push('/')}>THE CURATOR</div>
                <div className="v3-actions">
                    <span className="v3-action-btn" onClick={() => router.push('/category')}>COLLECTIONS</span>
                </div>
            </header>

            <div className="v3-layout">
                {/* DESKTOP SIDEBAR */}
                <aside className="v3-sidebar">
                    <div className="v3-sidebar-sticky">
                        <h3 className="v3-sidebar-heading">Filters</h3>
                        <FilterContent />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="v3-main">
                    <div className="v3-main-header">
                        <h1 className="v3-page-title">
                            {selectedCategories.length === 1
                                ? CATEGORY_OPTIONS.find(c => c.id === selectedCategories[0])?.label.toUpperCase()
                                : 'COLLECTION'}
                        </h1>
                        <p className="v3-count">{filteredProducts.length} Products</p>

                        {/* MOBILE FILTER TRIGGER */}
                        <button className="v3-mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
                            FILTERS {selectedCategories.length + selectedSizes.length > 0 && `(${selectedCategories.length + selectedSizes.length})`}
                        </button>
                    </div>

                    {/* PRODUCT GRID */}
                    <div className="v3-grid">
                        {loading ? (
                            <div className="v3-loading-state">
                                <p>LOADING COLLECTION...</p>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence>
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            className="v3-card"
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                                <div className="v3-image-wrapper">
                                                    <Image
                                                        src={product.images[0] || '/assets/man_editorial.png'}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        priority={index < 6}
                                                        quality={80}
                                                    />
                                                </div>
                                                <div className="v3-card-info">
                                                    <h3 className="v3-card-title">{product.title}</h3>
                                                    <span className="v3-card-price">{product.displayPrice}</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {filteredProducts.length === 0 && (
                                    <div className="v3-no-results">
                                        <p>No products match your filters.</p>
                                        <button onClick={() => {
                                            setSelectedCategories([]);
                                            setSelectedSizes([]);
                                            setSelectedPriceRange(PRICE_RANGES[0]);
                                        }}>Clear All</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* MOBILE FILTER DRAWER */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            className="v3-drawer-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                        />
                        <motion.div
                            className="v3-drawer"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="v3-drawer-header">
                                <h3>Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)}>CLOSE</button>
                            </div>
                            <div className="v3-drawer-content">
                                <FilterContent />
                            </div>
                            <div className="v3-drawer-footer">
                                <button className="v3-apply-btn" onClick={() => setIsMobileFilterOpen(false)}>
                                    VIEW {filteredProducts.length} ITEMS
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&display=swap');

                :root {
                    --v3-bg: #FFFFFF;
                    --v3-text: #111111;
                    --v3-gray: #888888;
                    --v3-border: #E5E5E5;
                }

                * { box-sizing: border-box; }
                body { margin: 0; background: var(--v3-bg); color: var(--v3-text); font-family: 'Manrope', sans-serif; }

                .v3-container {
                    min-height: 100vh;
                }

                /* HEADER */
                .v3-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 70px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 3rem;
                    background: rgba(255,255,255,0.95);
                    border-bottom: 1px solid var(--v3-border);
                    z-index: 100;
                }

                .v3-brand {
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .v3-action-btn {
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    letter-spacing: 1px;
                }

                /* LAYOUT */
                .v3-layout {
                    display: flex;
                    padding-top: 70px;
                    min-height: 100vh;
                }

                /* SIDEBAR (Desktop) */
                .v3-sidebar {
                    width: 280px;
                    border-right: 1px solid var(--v3-border);
                    padding: 3rem 2rem;
                    display: block;
                }

                .v3-sidebar-sticky {
                    position: sticky;
                    top: 100px;
                }

                .v3-sidebar-heading {
                    font-family: 'Italiana', serif;
                    font-size: 1.5rem;
                    margin: 0 0 2rem 0;
                }

                /* MAIN CONTENT */
                .v3-main {
                    flex: 1;
                    padding: 3rem 4rem;
                }

                .v3-main-header {
                    margin-bottom: 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                }

                .v3-page-title {
                    font-family: 'Italiana', serif;
                    font-size: 3rem;
                    margin: 0;
                    font-weight: 400;
                }

                .v3-count {
                    color: var(--v3-gray);
                    font-size: 0.9rem;
                }

                .v3-mobile-filter-btn {
                    display: none;
                }

                /* FILTERS UI */
                .v3-filter-group {
                    margin-bottom: 2.5rem;
                }

                .v3-filter-title {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0 0 1rem 0;
                    font-weight: 600;
                }

                .v3-checkbox-group, .v3-radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .v3-checkbox-label, .v3-radio-label {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 0.9rem;
                    cursor: pointer;
                    color: #444;
                }

                .v3-checkbox-label input, .v3-radio-label input {
                    display: none;
                }

                /* Custom Checkbox */
                .v3-checkmark {
                    width: 16px;
                    height: 16px;
                    border: 1px solid #ccc;
                    display: inline-block;
                    position: relative;
                }

                .v3-checkbox-label input:checked + .v3-checkmark {
                    background: black;
                    border-color: black;
                }

                /* Custom Radio */
                .v3-radio-custom {
                    width: 16px;
                    height: 16px;
                    border: 1px solid #ccc;
                    border-radius: 50%;
                    display: inline-block;
                }

                .v3-radio-label input:checked + .v3-radio-custom {
                    background: black;
                    border: 4px solid white;
                    box-shadow: 0 0 0 1px black;
                }

                /* Size Grid */
                .v3-size-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.5rem;
                }

                .v3-size-btn {
                    border: 1px solid var(--v3-border);
                    background: none;
                    padding: 0.5rem 0;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .v3-size-btn:hover { border-color: black; }
                .v3-size-btn.active { background: black; color: white; border-color: black; }

                /* GRID */
                .v3-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3rem 2rem;
                }

                .v3-card {
                    cursor: pointer;
                }

                .v3-image-wrapper {
                    width: 100%;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                    background: #f5f5f5;
                    margin-bottom: 1rem;
                    position: relative;
                }

                .v3-image-wrapper img {
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .v3-card:hover .v3-image-wrapper img {
                    transform: scale(1.05);
                }

                .v3-card-title {
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    margin: 0 0 0.3rem 0;
                    text-transform: uppercase;
                }

                .v3-card-price {
                    font-size: 0.85rem;
                    color: var(--v3-gray);
                }

                .v3-loading-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem;
                    font-family: 'Italiana', serif;
                    font-size: 1.5rem;
                    color: var(--v3-gray);
                    animation: pulse 1.5s infinite ease-in-out;
                }

                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }

                .v3-no-results {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem;
                    color: var(--v3-gray);
                }

                .v3-no-results button {
                    margin-top: 1rem;
                    background: black;
                    color: white;
                    border: none;
                    padding: 0.8rem 2rem;
                    cursor: pointer;
                    font-family: 'Manrope', sans-serif;
                    letter-spacing: 1px;
                }

                /* MOBILE DRAWER */
                .v3-drawer-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 200;
                }

                .v3-drawer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 85vh;
                    background: white;
                    z-index: 201;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    flex-direction: column;
                }

                .v3-drawer-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--v3-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .v3-drawer-header h3 { margin: 0; font-family: 'Italiana', serif; font-size: 1.5rem; }
                .v3-drawer-header button { background: none; border: none; font-weight: 600; cursor: pointer; }

                .v3-drawer-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                }

                .v3-drawer-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--v3-border);
                }

                .v3-apply-btn {
                    width: 100%;
                    background: black;
                    color: white;
                    border: none;
                    padding: 1rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .v3-sidebar { display: none; } /* Hide sidebar on tablet/mobile */
                    
                    .v3-main { padding: 2rem 1.5rem; }
                    
                    .v3-main-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                        margin-bottom: 2rem;
                    }

                    .v3-page-title { font-size: 2.5rem; }
                    .v3-count { display: none; }

                    .v3-mobile-filter-btn {
                        display: inline-block;
                        border: 1px solid black;
                        background: white;
                        padding: 0.6rem 1.5rem;
                        font-family: 'Manrope', sans-serif;
                        font-size: 0.8rem;
                        font-weight: 600;
                        letter-spacing: 1px;
                        cursor: pointer;
                        width: 100%;
                    }

                    .v3-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductListingPage;
