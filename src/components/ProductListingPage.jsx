"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import styles from './ProductListingPage.module.css';

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
        <div className={styles.filters}>
            {/* Categories */}
            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Category</h4>
                <div className={styles.checkboxGroup}>
                    {CATEGORY_OPTIONS.map(opt => (
                        <label key={opt.id} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(opt.id)}
                                onChange={() => toggleCategory(opt.id)}
                            />
                            <span className={styles.checkmark}></span>
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Price</h4>
                <div className={styles.radioGroup}>
                    {PRICE_RANGES.map(range => (
                        <label key={range.id} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="price"
                                checked={selectedPriceRange.id === range.id}
                                onChange={() => setSelectedPriceRange(range)}
                            />
                            <span className={styles.radioCustom}></span>
                            {range.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Size</h4>
                <div className={styles.sizeGrid}>
                    {SIZE_OPTIONS.map(size => (
                        <button
                            key={size}
                            className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.sizeBtnActive : ''}`}
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
        <div className={styles.container}>
            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.brand} onClick={() => router.push('/')}>THE CURATOR</div>
                <div className={styles.actions}>
                    <span className={styles.actionBtn} onClick={() => router.push('/category')}>COLLECTIONS</span>
                </div>
            </header>

            <div className={styles.layout}>
                {/* DESKTOP SIDEBAR */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSticky}>
                        <h3 className={styles.sidebarHeading}>Filters</h3>
                        <FilterContent />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className={styles.main}>
                    <div className={styles.mainHeader}>
                        <h1 className={styles.pageTitle}>
                            {selectedCategories.length === 1
                                ? CATEGORY_OPTIONS.find(c => c.id === selectedCategories[0])?.label.toUpperCase()
                                : 'COLLECTION'}
                        </h1>
                        <p className={styles.count}>{filteredProducts.length} Products</p>

                        {/* MOBILE FILTER TRIGGER */}
                        <button className={styles.mobileFilterBtn} onClick={() => setIsMobileFilterOpen(true)}>
                            FILTERS {selectedCategories.length + selectedSizes.length > 0 && `(${selectedCategories.length + selectedSizes.length})`}
                        </button>
                    </div>

                    {/* PRODUCT GRID */}
                    <div className={styles.grid}>
                        {loading ? (
                            <div className={styles.loadingState}>
                                <p>LOADING COLLECTION...</p>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence>
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            className={styles.card}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                                <div className={styles.imageWrapper}>
                                                    <Image
                                                        src={product.images[0] || '/assets/man_editorial.png'}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        priority={index < 6}
                                                        quality={80}
                                                    />
                                                </div>
                                                <div className={styles.cardInfo}>
                                                    <h3 className={styles.cardTitle}>{product.title}</h3>
                                                    <span className={styles.cardPrice}>{product.displayPrice}</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {filteredProducts.length === 0 && (
                                    <div className={styles.noResults}>
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
                            className={styles.drawerBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                        />
                        <motion.div
                            className={styles.drawer}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className={styles.drawerHeader}>
                                <h3>Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)}>CLOSE</button>
                            </div>
                            <div className={styles.drawerContent}>
                                <FilterContent />
                            </div>
                            <div className={styles.drawerFooter}>
                                <button className={styles.applyBtn} onClick={() => setIsMobileFilterOpen(false)}>
                                    VIEW {filteredProducts.length} ITEMS
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductListingPage;
