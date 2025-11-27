"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import styles from './CategoryPage.module.css';

const CategoryPage = ({ initialCategories }) => {
    const router = useRouter();
    const { categories, loading, error } = useCategories(initialCategories);

    // Loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-manrope), sans-serif'
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
                fontFamily: 'var(--font-manrope), sans-serif',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <p>Error loading categories: {error.message}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.brand} onClick={() => router.push('/')}>THE CURATOR</div>
                <div className={styles.close} onClick={() => router.push('/')}>CLOSE</div>
            </header>

            <div className={styles.intro}>
                <h1 className={styles.title}>Collections</h1>

                {/* DESKTOP PROCESS (V30 Style) */}
                <div className={styles.processContainerDesktop}>
                    <div className={styles.processStep}>
                        <span className={styles.stepNum}>01</span>
                        <h3 className={styles.stepTitle}>WE CURATE</h3>
                        <p className={styles.stepDesc}>Expertly selected pieces from top brands.</p>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.processStep}>
                        <span className={styles.stepNum}>02</span>
                        <h3 className={styles.stepTitle}>YOU DISCOVER</h3>
                        <p className={styles.stepDesc}>Browse collections tailored to your style.</p>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.processStep}>
                        <span className={styles.stepNum}>03</span>
                        <h3 className={styles.stepTitle}>WE REDIRECT</h3>
                        <p className={styles.stepDesc}>Seamlessly purchase from the original retailer.</p>
                    </div>
                </div>

                {/* MOBILE PROCESS (V31 Style) */}
                <div className={styles.processContainerMobile}>
                    <div className={styles.processStepMobile}>
                        <span className={styles.stepNumMobile}>01</span>
                        <h3 className={styles.stepTitleMobile}>CURATE</h3>
                        <p className={styles.stepDescMobile}>We select.</p>
                    </div>
                    <div className={styles.processStepMobile}>
                        <span className={styles.stepNumMobile}>02</span>
                        <h3 className={styles.stepTitleMobile}>SELECT</h3>
                        <p className={styles.stepDescMobile}>You choose.</p>
                    </div>
                    <div className={styles.processStepMobile}>
                        <span className={styles.stepNumMobile}>03</span>
                        <h3 className={styles.stepTitleMobile}>REDIRECT</h3>
                        <p className={styles.stepDescMobile}>We send.</p>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {categories.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <Link href={`/collection/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    priority={index < 6}
                                    quality={80}
                                />
                            </div>
                            <div className={styles.cardMeta}>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <span className={styles.cardSub}>{item.subtitle}</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <footer className={styles.footer}>
                <span>© 2024 THE CURATOR</span>
            </footer>
        </div>
    );
};

export default CategoryPage;
