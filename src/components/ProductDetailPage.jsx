"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useProductBySlug } from '@/hooks/useProducts';

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
                <button
                    className="v8-add-btn"
                    onClick={() => {
                        if (product.externalUrl) {
                            window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
                        }
                    }}
                    disabled={!product.externalUrl}
                >
                    {product.externalUrl ? 'VISIT STORE' : 'COMING SOON'}
                </button>
            </div>
        </div >
    );
};

// --- DESKTOP COMPONENT (Reimagined Premium Layout) ---
const DesktopView = ({ product, selectedSize, setSelectedSize, SIZES }) => {
    const router = useRouter();

    return (
        <div className="pdp-wrapper">
            {/* Sticky Header */}
            <header className="pdp-sticky-header">
                <div className="pdp-header-brand">THE CURATOR</div>
                <div className="pdp-header-back" onClick={() => router.back()}>BACK</div>
            </header>

            {/* Main Scroll Container (The only thing that scrolls) */}
            <div className="pdp-scroll-container">

                {/* Main Content Grid */}
                <div className="pdp-main-grid">

                    {/* LEFT: Image Stack */}
                    <div className="pdp-image-column">
                        <div className="pdp-image-stack">
                            {product.images.map((img, index) => (
                                <div key={index} className="pdp-image-item">
                                    <Image
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="50vw"
                                        priority={index === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Details */}
                    <div className="pdp-details-column">
                        <div className="pdp-sticky-content">
                            {/* Header */}
                            <div className="pdp-header">
                                <div className="pdp-tags">
                                    <span className="pdp-tag">NEW ARRIVAL</span>
                                    <span className="pdp-tag">TRENDING</span>
                                </div>
                                <h1 className="pdp-title">{product.title}</h1>
                                <p className="pdp-price">{product.price}</p>
                            </div>

                            {/* Description */}
                            <div className="pdp-description">
                                <p>{product.description}</p>
                            </div>

                            {/* Color Selection */}
                            <div className="pdp-section">
                                <span className="pdp-label">COLOUR: BLACK</span>
                                <div className="pdp-color-options">
                                    <div className="color-circle black selected"></div>
                                    <div className="color-circle beige"></div>
                                    <div className="color-circle olive"></div>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="pdp-section">
                                <div className="pdp-size-header">
                                    <span className="pdp-label">SIZE</span>
                                    <span className="pdp-size-guide">SIZE GUIDE</span>
                                </div>
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

                            {/* Actions */}
                            <div className="pdp-actions">
                                <button
                                    className="pdp-add-btn"
                                    onClick={() => product.externalUrl && window.open(product.externalUrl, '_blank')}
                                    disabled={!product.externalUrl}
                                >
                                    {product.externalUrl ? 'ADD TO BAG' : 'SOLD OUT'}
                                </button>
                                <p className="pdp-shipping-info">FREE SHIPPING ON ORDERS OVER $200</p>
                            </div>

                            {/* Meta Details */}
                            <div className="pdp-meta">
                                <div className="pdp-meta-item">
                                    <span className="label">COMPOSITION</span>
                                    <span className="value">{product.composition}</span>
                                </div>
                                <div className="pdp-meta-item">
                                    <span className="label">FIT</span>
                                    <span className="value">{product.fit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete the Look (Outside Grid, Inside Scroll Container) */}
                {product.suggestedProducts && product.suggestedProducts.length > 0 && (
                    <div className="pdp-suggestions-wrapper">
                        <h3 className="pdp-suggestions-title">COMPLETE THE LOOK</h3>
                        <div className="pdp-suggestions-grid">
                            {product.suggestedProducts.map((item) => (
                                <Link href={`/product/${item.slug}`} key={item.id} className="pdp-suggestion-card">
                                    <div className="suggestion-img-wrap">
                                        <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="suggestion-info-wrap">
                                        <span className="suggestion-title">{item.title}</span>
                                        <span className="suggestion-price">{item.displayPrice}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUGGESTIONS COMPONENT (Mobile Only Reuse) ---
const SuggestionsList = ({ suggestions, isMobile }) => {
    if (!suggestions || suggestions.length === 0) return null;
    if (!isMobile) return null;

    return (
        <div className={`suggestions-container mobile`}>
            <h3 className="suggestions-title">PAIR IT WITH</h3>
            <div className="suggestions-grid">
                {suggestions.map((item) => (
                    <Link href={`/product/${item.slug}`} key={item.id} className="suggestion-card">
                        <div className="suggestion-image">
                            <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="suggestion-info">
                            <p className="suggestion-name">{item.title}</p>
                            <p className="suggestion-price">{item.displayPrice}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
};

// --- MAIN COMPONENT ---
const ProductDetailPage = ({ initialProduct }) => {
    const params = useParams();
    const slug = params.id;

    const { product, loading, error } = useProductBySlug(slug, initialProduct);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [selectedSize, setSelectedSize] = useState(null);
    const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (error || !product) return <div>Product not found</div>;

    const formattedProduct = { ...product, price: product.displayPrice, fit: product.fitDescription };

    return (
        <>
            {isMobile ? (
                <>
                    <MobileView
                        product={formattedProduct}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        SIZES={product.sizes}
                    />
                    <div style={{ paddingBottom: '100px', background: '#fff' }}>
                        <SuggestionsList suggestions={product.suggestedProducts} isMobile={true} />
                    </div>
                </>
            ) : (
                <DesktopView
                    product={formattedProduct}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    SIZES={product.sizes}
                />
            )}

            <style>{`
                :root {
                    --pdp-bg: #fff;
                    --pdp-text: #000;
                    --font-heading: var(--font-instrument-serif), serif;
                    --font-body: var(--font-manrope), sans-serif;
                }

                * { box-sizing: border-box; }
                body { margin: 0; background: var(--pdp-bg); color: var(--pdp-text); }

                /* --- SHARED / MOBILE STYLES --- */
                .suggestions-container.mobile { padding: 0 0 2rem 1.5rem; }
                .suggestions-container.mobile .suggestions-grid { display: flex; gap: 1rem; overflow-x: auto; padding-right: 1.5rem; scrollbar-width: none; }
                .suggestions-container.mobile .suggestions-grid::-webkit-scrollbar { display: none; }
                .suggestion-card { width: 160px; flex-shrink: 0; text-decoration: none; color: inherit; }
                .suggestion-image { position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; margin-bottom: 0.5rem; }
                .suggestion-name { font-family: var(--font-body); font-size: 0.9rem; font-weight: 500; margin: 0; }
                .suggestion-price { font-family: var(--font-body); font-size: 0.85rem; color: #666; margin: 0; }
                .suggestions-title { font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 400; }

                /* Mobile Header/Layout Styles (V8) */
                .v8-mobile-container { padding-top: 60px; }
                .v8-mobile-header { position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: #fff; display: flex; alignItems: center; justify-content: space-between; padding: 0 1.5rem; z-index: 100; border-bottom: 1px solid #f5f5f5; }
                .v8-header-center { font-family: var(--font-heading); font-size: 1.5rem; }
                .v8-breadcrumbs { padding: 1rem 1.5rem; font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
                .v8-breadcrumbs .active { color: #000; font-weight: 600; }
                .v8-gallery-container { position: relative; margin-bottom: 2rem; }
                .v8-badge-save { position: absolute; top: 1rem; left: 1.5rem; background: #DCEAF5; color: #2A5D85; padding: 0.4rem 0.8rem; font-size: 0.8rem; font-weight: 600; z-index: 10; }
                .v8-badge-vertical { position: absolute; top: 50%; right: 0; transform: translateY(-50%); background: rgba(255,255,255,0.9); padding: 1rem 0.4rem; writing-mode: vertical-rl; font-size: 0.7rem; letter-spacing: 1px; border: 1px solid #eee; border-right: none; z-index: 10; }
                .v8-gallery-scroll { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
                .v8-gallery-scroll::-webkit-scrollbar { display: none; }
                .v8-image-slide { min-width: 100%; aspect-ratio: 4/5; scroll-snap-align: start; position: relative; }
                .v8-progress-container { width: 100%; height: 4px; background: #f0f0f0; margin-top: 1rem; padding: 0 1.5rem; }
                .v8-progress-bar { height: 100%; background: #9FBAD3; transition: width 0.3s ease; }
                .v8-info-section { padding: 0 1.5rem 2rem 1.5rem; }
                .v8-stock-indicator { display: flex; alignItems: center; gap: 0.5rem; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem; }
                .v8-stock-indicator .dot { width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; }
                .v8-title { font-family: var(--font-heading); font-size: 2rem; margin: 0 0 0.5rem 0; font-weight: 400; line-height: 1.2; }
                .v8-price { font-family: var(--font-body); font-size: 1.1rem; margin-bottom: 1.5rem; }
                .v8-desc { font-size: 0.95rem; line-height: 1.6; color: #555; margin-bottom: 2rem; }
                .v8-label { font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem; letter-spacing: 1px; display: block; }
                .v8-size-grid { display: flex; gap: 0.8rem; margin-bottom: 2rem; }
                .v8-size-btn { width: 3rem; height: 3rem; border: 1px solid #ddd; background: transparent; cursor: pointer; transition: all 0.2s; }
                .v8-size-btn.active { background: #000; color: #fff; border-color: #000; }
                .v8-details-list { border-top: 1px solid #eee; padding-top: 1.5rem; }
                .v8-detail-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.8rem; color: #444; }
                .v8-sticky-footer { position: fixed; bottom: 0; left: 0; width: 100%; padding: 1rem 1.5rem; background: #fff; border-top: 1px solid #eee; z-index: 100; }
                .v8-add-btn { width: 100%; background: #000; color: #fff; border: none; padding: 1rem; font-weight: 700; font-size: 0.8rem; letter-spacing: 1px; cursor: pointer; }


                /* --- DESKTOP STYLES (REIMAGINED) --- */
                .pdp-wrapper {
                    width: 100%;
                    height: 100vh; /* Fixed height for inner scrolling */
                    overflow: hidden; /* Prevent window scroll */
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                }

                .pdp-sticky-header {
                    position: sticky;
                    top: 0;
                    width: 100%;
                    height: 60px;
                    background: #fff;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 4rem;
                    z-index: 100;
                    flex-shrink: 0;
                }

                .pdp-header-brand {
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 400;
                    letter-spacing: 2px;
                }

                .pdp-header-back {
                    font-family: var(--font-body);
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .pdp-header-back:hover { opacity: 1; }

                .pdp-scroll-container {
                    width: 100%;
                    flex: 1;
                    overflow-y: auto; /* The main scroll area */
                    scrollbar-width: none;
                }
                .pdp-scroll-container::-webkit-scrollbar { display: none; }

                .pdp-main-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr; /* 60/40 split roughly */
                    gap: 4rem;
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 0 4rem;
                    /* height: 100%;  Removed fixed height to allow content to flow */
                }

                /* Left Column: Images */
                .pdp-image-column {
                    padding-top: 2rem;
                    display: flex;
                    flex-direction: column;
                    /* Removed overflow/height to allow natural flow */
                }

                .pdp-image-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem; /* Space between images */
                    width: 100%;
                }

                .pdp-image-item {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3/4; /* Consistent portrait ratio */
                    background: #f9f9f9;
                }

                /* Right Column: Sticky Details */
                .pdp-details-column {
                    position: relative;
                    padding-top: 6rem; /* Offset to align with first image roughly */
                    /* Removed overflow/height */
                }

                .pdp-sticky-content {
                    position: sticky;
                    top: 2rem; /* Stick to top of scroll container */
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 450px; /* Constrain width for readability */
                    padding-bottom: 4rem;
                }

                .pdp-header {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 1.5rem;
                }

                .pdp-tags {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .pdp-tag {
                    font-size: 0.65rem;
                    border: 1px solid #000;
                    padding: 0.2rem 0.5rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .pdp-title {
                    font-family: var(--font-heading);
                    font-size: 2.5rem;
                    font-weight: 400;
                    margin: 0 0 0.5rem 0;
                    line-height: 1.1;
                }

                .pdp-price {
                    font-family: var(--font-body);
                    font-size: 1.25rem;
                    color: #b00; /* Accent color */
                    font-weight: 600;
                    margin: 0;
                }

                .pdp-description {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    color: #444;
                }

                .pdp-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .pdp-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .pdp-color-options {
                    display: flex;
                    gap: 1rem;
                }
                .color-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s;
                }
                .color-circle:hover { transform: scale(1.1); }
                .color-circle.selected::after {
                    content: '';
                    position: absolute;
                    top: -4px; left: -4px; right: -4px; bottom: -4px;
                    border: 1px solid #000;
                    border-radius: 50%;
                }
                .color-circle.black { background: #000; }
                .color-circle.beige { background: #e5e5d0; }
                .color-circle.olive { background: #556b2f; }

                .pdp-size-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .pdp-size-guide {
                    font-size: 0.7rem;
                    text-decoration: underline;
                    cursor: pointer;
                    color: #666;
                }

                .pdp-size-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .pdp-size-btn {
                    width: 3.5rem;
                    height: 3.5rem;
                    border: 1px solid #eee;
                    background: #fff;
                    font-family: var(--font-body);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .pdp-size-btn:hover { border-color: #000; }
                .pdp-size-btn.active { background: #000; color: #fff; border-color: #000; }

                .pdp-actions {
                    margin-top: 1rem;
                }
                .pdp-add-btn {
                    width: 100%;
                    padding: 1.2rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    font-family: var(--font-body);
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .pdp-add-btn:hover { opacity: 0.9; }
                .pdp-shipping-info {
                    text-align: center;
                    font-size: 0.7rem;
                    color: #666;
                    margin-top: 1rem;
                    letter-spacing: 0.5px;
                }

                .pdp-meta {
                    border-top: 1px solid #eee;
                    padding-top: 1.5rem;
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .pdp-meta-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #444;
                }
                .pdp-meta-item .label { font-weight: 600; }

                /* Suggestions Section (Outside Grid) */
                .pdp-suggestions-wrapper {
                    margin-top: 6rem;
                    padding: 4rem 4rem 4rem 4rem;
                    border-top: 1px solid #eee;
                    max-width: 1600px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .pdp-suggestions-title {
                    font-family: var(--font-heading);
                    font-size: 2rem;
                    margin-bottom: 2rem;
                    font-weight: 400;
                }
                .pdp-suggestions-grid {
                    display: flex;
                    gap: 2rem;
                }
                .pdp-suggestion-card {
                    width: 280px;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .suggestion-img-wrap {
                    width: 100%;
                    aspect-ratio: 3/4;
                    position: relative;
                    background: #f5f5f5;
                }
                .suggestion-info-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }
                .suggestion-title { font-weight: 600; font-size: 0.9rem; text-transform: uppercase; }
                .suggestion-price { color: #666; font-size: 0.9rem; }

                @media (max-width: 1200px) {
                    .pdp-main-grid {
                        gap: 2rem;
                        padding: 0 2rem;
                    }
                    .pdp-suggestions-wrapper {
                        padding: 4rem 2rem 4rem 2rem;
                    }
                    .pdp-sticky-header {
                        padding: 0 2rem;
                    }
                }
            `}</style>
        </>
    );
};

export default ProductDetailPage;
