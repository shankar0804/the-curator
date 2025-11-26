"use client";

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Lazy load the 3D component
// We disable SSR for the 3D part only, so the UI loads instantly
const LandingPage3D = dynamic(() => import('./LandingPage3D'), {
    ssr: false,
    loading: () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(circle at 70% 30%, #1a1a1a 0%, #000000 70%)',
            zIndex: 0
        }} />
    )
});

const LandingPage = () => {
    const router = useRouter();
    const progress = useMotionValue(0);

    // Ref to track if user is currently scrolling
    const isScrolling = useRef(false);
    const scrollTimeout = useRef(null);

    // Visual Transitions
    const textOpacity = useTransform(progress, [0, 0.15], [1, 0]);
    const overlayOpacity = useTransform(progress, [0.8, 0.98], [0, 1]);
    const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

    // Input Handling
    useEffect(() => {
        const handleInput = () => {
            isScrolling.current = true;
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                isScrolling.current = false;
            }, 150);
        };

        window.addEventListener('wheel', handleInput);
        window.addEventListener('touchstart', handleInput);
        window.addEventListener('touchmove', handleInput);
        window.addEventListener('keydown', handleInput);

        return () => {
            window.removeEventListener('wheel', handleInput);
            window.removeEventListener('touchstart', handleInput);
            window.removeEventListener('touchmove', handleInput);
            window.removeEventListener('keydown', handleInput);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    // Navigation Trigger
    useEffect(() => {
        const unsubscribe = progress.on("change", (latest) => {
            if (latest >= 0.99) {
                router.push('/category');
            }
        });
        return () => unsubscribe();
    }, [router, progress]);

    return (
        <>
            {/* 3D SCENE (Lazy Loaded) */}
            <LandingPage3D progress={progress} isScrolling={isScrolling} />

            {/* UI OVERLAY (Rendered Immediately) */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            >
                <motion.div style={{ textAlign: 'center', opacity: textOpacity }}>
                    <h1 style={{
                        fontFamily: 'var(--font-syncopate), sans-serif',
                        fontSize: '8vw',
                        lineHeight: 0.85,
                        margin: 0,
                        color: '#fff',
                        letterSpacing: '5px',
                        textShadow: '0 0 20px rgba(255,255,255,0.3)'
                    }}>
                        <span style={{
                            display: 'block',
                            fontSize: '4vw',
                            color: 'transparent',
                            WebkitTextStroke: '1px #fff',
                            opacity: 0.8
                        }}>THE</span>
                        CURATOR
                    </h1>

                    <div style={{ marginTop: '3rem' }}>
                        <p style={{
                            fontFamily: 'var(--font-syncopate), sans-serif',
                            color: '#fff',
                            fontSize: '0.8rem',
                            letterSpacing: '3px',
                            opacity: 0.7,
                            marginBottom: '2rem'
                        }}>
                            EFFORTLESS STYLE, CURATED FOR THE MODERN MAN
                        </p>

                        <button style={{
                            padding: '1rem 3rem',
                            background: 'transparent',
                            border: '1px solid #fff',
                            color: '#fff',
                            fontFamily: 'var(--font-syncopate), sans-serif',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            pointerEvents: 'auto'
                        }}>
                            ENTER EXPERIENCE
                        </button>
                    </div>
                </motion.div>

                <motion.div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    opacity: textOpacity,
                    fontFamily: 'var(--font-syncopate), sans-serif',
                    fontSize: '0.7rem',
                    color: '#fff',
                    letterSpacing: '3px'
                }}>
                    SCROLL TO EXPLORE
                </motion.div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 20
            }}>
                <motion.div style={{
                    width: progressWidth,
                    height: '100%',
                    background: '#fff',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }} />
            </div>

            {/* FADE TRANSITION OVERLAY */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ECEAE5',
                    zIndex: 50,
                    opacity: overlayOpacity,
                    pointerEvents: 'none'
                }}
            />

            <style>{`
        body {
          margin: 0;
          background: #000;
          overflow: hidden;
        }
      `}</style>
        </>
    );
};

export default LandingPage;
