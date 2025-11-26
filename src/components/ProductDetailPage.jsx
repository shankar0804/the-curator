"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Assets (using public paths)
const editorialShirt = '/assets/editorial_shirt.png';
const editorialPant = '/assets/editorial_pant.png';
const manEditorial = '/assets/man_editorial.png';
const fabricImage = '/assets/helix_fabric.png';

// Mock Data
const PRODUCTS = {
    'shirt': {
        id: 'shirt',
        title: 'THE OXFORD SHIRT',
        price: '$350',
        description: 'A masterclass in tailoring. Cut from Italian cotton poplin, this shirt features a relaxed yet structured silhouette. Finished with mother-of-pearl buttons and a signature elongated cuff.',
        composition: '100% Italian Cotton Poplin',
        fit: 'Relaxed fit. Model is 6\'1" and wears size M.',
        images: [editorialShirt, manEditorial, fabricImage, editorialShirt]
    },
    'pant': {
        id: 'pant',
        title: 'THE PLEATED TROUSER',
        price: '$495',
        description: 'Precision-cut trousers with a high rise and double pleats. Crafted from lightweight virgin wool for year-round wearability.',
        composition: '100% Virgin Wool',
        fit: 'Tapered leg. Model is 6\'1" and wears size 32.',
        images: [editorialPant, fabricImage, editorialPant, manEditorial]
    },
    // Fallback for other IDs
    'default': {
        id: 'default',
        title: 'THE CLASSIC ESSENTIAL',
        price: '$295',
        description: 'Timeless design meets modern luxury. An essential piece for the curated wardrobe.',
        composition: '100% Premium Cotton',
        fit: 'True to size.',
        images: [manEditorial, fabricImage, manEditorial, fabricImage]
    }
};

// --- HOOKS ---
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addListener(listener);
        return () => media.removeListener(listener);
    }, [matches, query]);
    return matches;
};

// --- MOBILE COMPONENT (AEVI Style V8) ---
const MobileView = ({ product, selectedSize, setSelectedSize, SIZES }) => {
    const router = useRouter();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const containerRef = useRef(null);

    // Handle scroll for header transition
    useEffect(() => {
        // Force scroll to top on mount
        window.scrollTo(0, 0);

        const handleWindowScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleWindowScroll);
        return () => window.removeEventListener('scroll', handleWindowScroll);
    }, []);

    // Handle horizontal scroll for progress bar
    const handleScroll = () => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft;
            const width = containerRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setActiveImageIndex(index);
        }
    };

    return (
        <div className="v8-mobile-container">
            {/* Sticky Header */}
            <header className={`v8-mobile-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="v8-header-left" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </div>
                <div className="v8-header-center">THE CURATOR</div>
                <div className="v8-header-right">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
            </header>

            {/* Breadcrumbs - Overlay */}
            <div className="v8-breadcrumbs">
                <span>HOME</span> / <span>COLLECTION</span> / <span className="active">{product.title}</span>
            </div>

            {/* Gallery Section */}
            <div className="v8-gallery-container">
                {/* Badges */}
                <div className="v8-badge-save">SAVE $50</div>
                <div className="v8-badge-vertical">
                    <span>× 10% OFF</span>
                </div>

                {/* Image Scroll */}
                <div
                    className="v8-gallery-scroll"
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {product.images.map((img, index) => (
                        <div key={index} className="v8-image-slide">
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <Image
                                    src={img}
                                    alt={`${product.title} ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="v8-progress-container">
                    <div
                        className="v8-progress-bar"
                        style={{
                            width: `${((activeImageIndex + 1) / product.images.length) * 100}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* Product Info */}
            <div className="v8-info-section">
                <div className="v8-stock-indicator">
                    <span className="dot"></span> In stock
                </div>

                <h1 className="v8-title">{product.title}</h1>
                <p className="v8-price">{product.price}</p>

                <p className="v8-desc">{product.description}</p>

                {/* Size Selection */}
                <div className="v8-size-section">
                    <span className="v8-label">SELECT SIZE</span>
                    <div className="v8-size-grid">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                className={`v8-size-btn ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="v8-details-list">
                    <div className="v8-detail-row">
                        <span>COMPOSITION</span>
                        <span>{product.composition}</span>
                    </div>
                    <div className="v8-detail-row">
                        <span>FIT</span>
                        <span>{product.fit}</span>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="v8-sticky-footer">
                <button className="v8-add-btn">
                    {selectedSize ? `ADD TO BAG - ${product.price}` : 'ADD TO BAG'}
                </button>
            </div>
        </div>
    );
};

// --- DESKTOP COMPONENT (Classic V1) ---
const DesktopView = ({ product, selectedSize, setSelectedSize, SIZES, expandedSection, toggleSection }) => {
    const router = useRouter();

    return (
        <div className="pdp-container">
            <header className="pdp-header">
                <div className="pdp-logo" onClick={() => router.push('/')}>CURATOR</div>
                <div className="pdp-close" onClick={() => router.back()}>CLOSE</div>
            </header>

            <div className="pdp-content">
                <div className="pdp-gallery">
                    {product.images.map((img, index) => (
                        <div key={index} className="pdp-image-wrapper">
                            <Image
                                src={img}
                                alt={`${product.title} view ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover', filter: 'sepia(15%) contrast(105%) brightness(95%) saturate(80%)' }}
                                sizes="65vw"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>

                <div className="pdp-details-col">
                    <div className="pdp-sticky-wrapper">
                        <div className="pdp-info-top">
                            <h1 className="pdp-title">{product.title}</h1>
                            <p className="pdp-price">{product.price}</p>
                        </div>

                        <div className="pdp-sizes">
                            <span className="pdp-label">SIZE</span>
                            <div className="pdp-size-grid">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="pdp-add-btn">
                            {selectedSize ? `ADD TO BAG - ${product.price}` : 'SELECT SIZE'}
                        </button>

                        <div className="pdp-accordions">
                            <AccordionItem title="DESCRIPTION" isOpen={expandedSection === 'description'} onClick={() => toggleSection('description')}>
                                <p>{product.description}</p>
                            </AccordionItem>
                            <AccordionItem title="COMPOSITION & CARE" isOpen={expandedSection === 'composition'} onClick={() => toggleSection('composition')}>
                                <p>{product.composition}</p>
                            </AccordionItem>
                            <AccordionItem title="SIZE & FIT" isOpen={expandedSection === 'fit'} onClick={() => toggleSection('fit')}>
                                <p>{product.fit}</p>
                            </AccordionItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccordionItem = ({ title, isOpen, onClick, children }) => {
    return (
        <div className="pdp-accordion-item">
            <div className="pdp-accordion-header" onClick={onClick}>
                <span>{title}</span>
                <span>{isOpen ? '−' : '+'}</span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div style={{ paddingBottom: '1.5rem' }}>{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MAIN COMPONENT ---
const ProductDetailPage = () => {
    const params = useParams();
    const id = params.id;
    const product = PRODUCTS[id] || PRODUCTS['default'];
    // Note: useMediaQuery might cause hydration mismatch if not handled carefully.
    // For simplicity in this port, we'll default to desktop and let client update, or use a robust hook.
    // Here we use a simple effect-based hook which is safe but might flash.
    const isMobile = useMediaQuery('(max-width: 1024px)');

    const [selectedSize, setSelectedSize] = useState(null);
    const [expandedSection, setExpandedSection] = useState('description');
    const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Prevent hydration mismatch by not rendering until mounted (optional but recommended)
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <>
            {isMobile ? (
                <MobileView
                    product={product}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    SIZES={SIZES}
                />
            ) : (
                <DesktopView
                    product={product}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    SIZES={SIZES}
                    expandedSection={expandedSection}
                    toggleSection={toggleSection}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Syncopate:wght@400;700&family=Space+Grotesk:wght@300;400;500&family=Manrope:wght@400;600&display=swap');

                :root {
                    --pdp-bg: #ECEAE5;
                    --pdp-text: #1A1A1A;
                    --pdp-border: rgba(0,0,0,0.1);
                }

                * { box-sizing: border-box; }
                body { margin: 0; overflow-x: hidden; }

                /* --- MOBILE STYLES (V8 AEVI Style) --- */
                .v8-mobile-container {
                    background: #fff;
                    color: #000;
                    min-height: 100vh;
                    width: 100%;
                    overflow-x: hidden; /* Prevent horizontal scroll */
                    font-family: 'Manrope', sans-serif;
                    padding-top: 60px; /* Space for fixed header */
                    padding-bottom: 80px; /* Space for sticky footer */
                    position: relative;
                }

                /* Force body/html background to white and prevent overflow ONLY ON MOBILE */
                @media (max-width: 1024px) {
                    html, body {
                        background-color: #fff !important;
                        overflow-x: hidden !important;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        overscroll-behavior-x: none;
                    }
                }

                .v8-mobile-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    z-index: 1000;
                    border-bottom: 1px solid #f5f5f5;
                }

                .v8-header-center {
                    font-family: 'Italiana', serif;
                    font-size: 1.5rem;
                    letter-spacing: 1px;
                }

                .v8-breadcrumbs {
                    width: 100%;
                    padding: 1rem 1.5rem;
                    font-size: 0.7rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: #fff;
                }

                .v8-breadcrumbs .active {
                    color: #000;
                    font-weight: 600;
                }

                .v8-gallery-container {
                    position: relative;
                    width: 100%;
                    margin-bottom: 2rem;
                }

                .v8-badge-save {
                    position: absolute;
                    top: 1rem;
                    left: 1.5rem;
                    background: #DCEAF5; /* Light blue from ref */
                    color: #2A5D85;
                    padding: 0.4rem 0.8rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 10;
                    border-radius: 2px;
                }

                .v8-badge-vertical {
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.9);
                    border: 1px solid #eee;
                    border-right: none;
                    padding: 1rem 0.4rem;
                    z-index: 10;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    font-size: 0.7rem;
                    letter-spacing: 1px;
                    color: #666;
                    border-radius: 4px 0 0 4px;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.05);
                }

                .v8-gallery-scroll {
                    display: flex;
                    width: 100%;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none;
                }
                .v8-gallery-scroll::-webkit-scrollbar { display: none; }

                .v8-image-slide {
                    min-width: 100%;
                    aspect-ratio: 4/5;
                    scroll-snap-align: start;
                    position: relative;
                }

                .v8-image-slide img {
                    object-fit: cover;
                }

                .v8-progress-container {
                    width: 100%;
                    height: 4px;
                    background: #f0f0f0;
                    margin-top: 1rem;
                    /* Align with content padding */
                    padding: 0 1.5rem; 
                    box-sizing: border-box;
                }

                .v8-progress-bar {
                    height: 100%;
                    background: #9FBAD3; /* Muted blue */
                    transition: width 0.3s ease;
                    /* Ensure bar starts from the very left of the container's content area */
                    transform-origin: left;
                }

                .v8-info-section {
                    padding: 0 1.5rem 2rem 1.5rem;
                }

                .v8-stock-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #666;
                    margin-bottom: 0.5rem;
                }

                .v8-stock-indicator .dot {
                    width: 8px;
                    height: 8px;
                    background: #4CAF50;
                    border-radius: 50%;
                }

                .v8-title {
                    font-family: 'Italiana', serif;
                    font-size: 2rem;
                    margin: 0 0 0.5rem 0;
                    font-weight: 400;
                    line-height: 1.2;
                }

                .v8-price {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.1rem;
                    color: #333;
                    margin: 0 0 1.5rem 0;
                }

                .v8-desc {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #555;
                    margin-bottom: 2rem;
                }

                .v8-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    letter-spacing: 1px;
                }

                .v8-size-grid {
                    display: flex;
                    gap: 0.8rem;
                    margin-bottom: 2rem;
                }

                .v8-size-btn {
                    width: 3rem;
                    height: 3rem;
                    border: 1px solid #ddd;
                    background: transparent;
                    font-family: 'Space Grotesk', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .v8-size-btn.active {
                    background: #000;
                    color: #fff;
                    border-color: #000;
                }

                .v8-details-list {
                    border-top: 1px solid #eee;
                    padding-top: 1.5rem;
                }

                .v8-detail-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    margin-bottom: 0.8rem;
                    color: #444;
                }

                .v8-sticky-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 1rem 1.5rem;
                    background: #fff;
                    border-top: 1px solid #eee;
                    z-index: 100;
                }

                .v8-add-btn {
                    width: 100%;
                    background: #000;
                    color: #fff;
                    border: none;
                    padding: 1rem;
                    font-family: 'Syncopate', sans-serif;
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                /* --- DESKTOP STYLES (V1 Classic) --- */
                .pdp-container { background-color: var(--pdp-bg); color: var(--pdp-text); min-height: 100vh; font-family: 'Space Grotesk', sans-serif; }
                .pdp-header { position: fixed; top: 0; left: 0; width: 100%; padding: 2rem 3rem; display: flex; justify-content: space-between; z-index: 100; mix-blend-mode: difference; color: #fff; }
                .pdp-logo, .pdp-close { font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; letter-spacing: 1px; }
                .pdp-content { display: flex; width: 100%; }
                .pdp-gallery { width: 65%; display: flex; flex-direction: column; }
                .pdp-image-wrapper { width: 100%; height: 120vh; overflow: hidden; position: relative; }
                .pdp-image-wrapper img { object-fit: cover; filter: sepia(15%) contrast(105%) brightness(95%) saturate(80%); }
                .pdp-details-col { width: 35%; padding: 8rem 4rem 4rem 4rem; position: relative; }
                .pdp-sticky-wrapper { position: sticky; top: 8rem; display: flex; flex-direction: column; gap: 3rem; }
                .pdp-title { font-family: 'Italiana', serif; font-size: 3rem; margin: 0 0 1rem 0; line-height: 1; font-weight: 400; }
                .pdp-price { font-family: 'Syncopate', sans-serif; font-size: 1.2rem; opacity: 0.7; }
                .pdp-label { display: block; font-size: 0.75rem; letter-spacing: 1px; margin-bottom: 1rem; opacity: 0.6; font-weight: 500; }
                .pdp-size-grid { display: flex; gap: 0.5rem; }
                .pdp-size-btn { width: 3rem; height: 3rem; border: 1px solid var(--pdp-border); background: transparent; font-family: 'Space Grotesk', sans-serif; cursor: pointer; transition: all 0.2s; }
                .pdp-size-btn:hover { border-color: var(--pdp-text); }
                .pdp-size-btn.active { background: var(--pdp-text); color: var(--pdp-bg); border-color: var(--pdp-text); }
                .pdp-add-btn { width: 100%; padding: 1.5rem; background: var(--pdp-text); color: var(--pdp-bg); border: none; font-family: 'Syncopate', sans-serif; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: opacity 0.3s; }
                .pdp-add-btn:hover { opacity: 0.9; }
                .pdp-accordion-item { border-top: 1px solid var(--pdp-border); }
                .pdp-accordion-item:last-child { border-bottom: 1px solid var(--pdp-border); }
                .pdp-accordion-header { padding: 1.5rem 0; display: flex; justify-content: space-between; cursor: pointer; font-family: 'Syncopate', sans-serif; font-size: 0.8rem; letter-spacing: 1px; }
            `}</style>
        </>
    );
};

export default ProductDetailPage;
