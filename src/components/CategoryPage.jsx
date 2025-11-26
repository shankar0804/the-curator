"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';

const CategoryPage = () => {
    const router = useRouter();
    const { categories, loading, error } = useCategories();

    // Loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Manrope, sans-serif'
            }}>
                Loading categories...
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Manrope, sans-serif',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <p>Error loading categories: {error.message}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="v32-container">
            <header className="v32-header">
                <div className="v32-brand" onClick={() => router.push('/')}>THE CURATOR</div>
                <div className="v32-close" onClick={() => router.push('/')}>CLOSE</div>
            </header>

            <div className="v32-intro">
                <h1 className="v32-title">Collections</h1>

                {/* DESKTOP PROCESS (V30 Style) */}
                <div className="v32-process-container-desktop">
                    <div className="v32-process-step">
                        <span className="v32-step-num">01</span>
                        <h3 className="v32-step-title">WE CURATE</h3>
                        <p className="v32-step-desc">Expertly selected pieces from top brands.</p>
                    </div>
                    <div className="v32-divider"></div>
                    <div className="v32-process-step">
                        <span className="v32-step-num">02</span>
                        <h3 className="v32-step-title">YOU DISCOVER</h3>
                        <p className="v32-step-desc">Browse collections tailored to your style.</p>
                    </div>
                    <div className="v32-divider"></div>
                    <div className="v32-process-step">
                        <span className="v32-step-num">03</span>
                        <h3 className="v32-step-title">WE REDIRECT</h3>
                        <p className="v32-step-desc">Seamlessly purchase from the original retailer.</p>
                    </div>
                </div>

                {/* MOBILE PROCESS (V31 Style) */}
                <div className="v32-process-container-mobile">
                    <div className="v32-process-step-mobile">
                        <span className="v32-step-num-mobile">01</span>
                        <h3 className="v32-step-title-mobile">CURATE</h3>
                        <p className="v32-step-desc-mobile">We select.</p>
                    </div>
                    <div className="v32-process-step-mobile">
                        <span className="v32-step-num-mobile">02</span>
                        <h3 className="v32-step-title-mobile">SELECT</h3>
                        <p className="v32-step-desc-mobile">You choose.</p>
                    </div>
                    <div className="v32-process-step-mobile">
                        <span className="v32-step-num-mobile">03</span>
                        <h3 className="v32-step-title-mobile">REDIRECT</h3>
                        <p className="v32-step-desc-mobile">We send.</p>
                    </div>
                </div>
            </div>

            <div className="v32-grid">
                {categories.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="v32-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => router.push(`/collection/${item.slug}`)}
                    >
                        <div className="v32-image-container">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                        </div>
                        <div className="v32-card-meta">
                            <h3 className="v32-card-title">{item.title}</h3>
                            <span className="v32-card-sub">{item.subtitle}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <footer className="v32-footer">
                <span>© 2024 THE CURATOR</span>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;500;600&display=swap');

                :root {
                    --v32-bg: #FFFFFF;
                    --v32-text: #111111;
                    --v32-gray: #888888;
                    --v32-light-gray: #e0e0e0;
                }

                * { box-sizing: border-box; }
                body { margin: 0; background: var(--v32-bg); color: var(--v32-text); overflow-x: hidden; }

                .v32-container {
                    width: 100%;
                    min-height: 100vh;
                    padding-top: 80px;
                }

                /* --- HEADER --- */
                .v32-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 80px;
                    padding: 0 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 100;
                    background: rgba(255, 255, 255, 0.98);
                }

                .v32-brand, .v32-close {
                    font-family: 'Manrope', sans-serif;
                    font-weight: 600;
                    font-size: 0.8rem;
                    letter-spacing: 1.5px;
                    cursor: pointer;
                    text-transform: uppercase;
                }

                /* --- INTRO & PROCESS --- */
                .v32-intro {
                    text-align: center;
                    padding: 4rem 0 6rem 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .v32-title {
                    font-family: 'Italiana', serif;
                    font-size: 3.5rem;
                    font-weight: 400;
                    margin: 0 0 4rem 0;
                }

                /* DESKTOP PROCESS STYLES (V30) */
                .v32-process-container-desktop {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 3rem;
                    padding: 0 2rem;
                }

                .v32-process-step {
                    flex: 1;
                    max-width: 300px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .v32-step-num {
                    font-family: 'Italiana', serif;
                    font-size: 1.2rem;
                    color: var(--v32-gray);
                    margin-bottom: 0.5rem;
                }

                .v32-step-title {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin: 0;
                }

                .v32-step-desc {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.85rem;
                    color: var(--v32-gray);
                    line-height: 1.5;
                    margin: 0;
                }

                .v32-divider {
                    width: 1px;
                    height: 60px;
                    background: var(--v32-light-gray);
                    margin-top: 10px;
                }

                /* MOBILE PROCESS STYLES (V31) - Hidden by default */
                .v32-process-container-mobile {
                    display: none;
                }

                /* --- GRID --- */
                .v32-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 4rem 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 0 3rem 6rem 3rem;
                }

                .v32-card {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .v32-image-container {
                    width: 100%;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                    background: #f0f0f0;
                    position: relative;
                }

                .v32-image-container img {
                    object-fit: cover;
                    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .v32-card:hover .v32-image-container img {
                    transform: scale(1.03);
                }

                .v32-card-meta {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.3rem;
                }

                .v32-card-title {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 500;
                    letter-spacing: 1px;
                    margin: 0;
                    text-transform: uppercase;
                }

                .v32-card-sub {
                    font-family: 'Italiana', serif;
                    font-size: 0.9rem;
                    color: var(--v32-gray);
                }

                /* --- FOOTER --- */
                .v32-footer {
                    text-align: center;
                    padding: 4rem;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.7rem;
                    letter-spacing: 1px;
                    color: var(--v32-gray);
                }

                /* --- RESPONSIVE --- */
                @media (max-width: 1024px) {
                    .v32-grid {
                        grid-template-columns: repeat(2, 1fr);
                        padding: 0 2rem 4rem 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .v32-header { padding: 0 1.5rem; }
                    
                    .v32-intro { padding: 3rem 0 2rem 0; }
                    .v32-title { font-size: 2.5rem; margin-bottom: 2rem; padding: 0 1.5rem; }
                    
                    /* HIDE DESKTOP PROCESS */
                    .v32-process-container-desktop { display: none; }

                    /* SHOW MOBILE PROCESS (V31 Style) */
                    .v32-process-container-mobile {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        padding: 0 1.5rem;
                        gap: 0.5rem;
                    }

                    .v32-process-step-mobile {
                        min-width: 0;
                        flex: 1;
                        padding: 0;
                        text-align: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                    }

                    .v32-step-num-mobile {
                        font-family: 'Italiana', serif;
                        font-size: 0.9rem;
                        color: var(--v32-gray);
                        margin-bottom: 0.3rem;
                    }

                    .v32-step-title-mobile {
                        font-family: 'Manrope', sans-serif;
                        font-size: 0.65rem;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        margin: 0;
                    }

                    .v32-step-desc-mobile {
                        font-family: 'Manrope', sans-serif;
                        font-size: 0.6rem;
                        color: var(--v32-gray);
                        white-space: nowrap;
                        margin: 0;
                    }

                    /* MOBILE GRID (V31 Style) */
                    .v32-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem 1rem;
                        padding: 0 1rem 4rem 1rem;
                    }

                    .v32-card { gap: 0.5rem; }
                    .v32-card-title { font-size: 0.75rem; }
                    .v32-card-sub { font-size: 0.7rem; }
                }
            `}</style>
        </div>
    );
};

export default CategoryPage;
