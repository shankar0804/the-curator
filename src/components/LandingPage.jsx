"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, useTexture } from '@react-three/drei';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

// Asset Path
const threadTexture = "/assets/silver_thread_texture.png";

// --- NEON HELIX COMPONENT (Brighter) ---
const ThreadHelix = (props) => {
    const ref = useRef();
    const texture = useTexture(threadTexture);

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 2);

    const curve = useMemo(() => {
        const points = [];
        const count = 100;

        for (let i = 0; i <= count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 16;
            const radius = 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (t * 80) - 20;
            points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.z -= delta / 5;
        }
    });

    const materialProps = {
        map: texture,
        roughnessMap: texture,
        bumpMap: texture,
        bumpScale: 0.15,
        color: "#ffffff",
        emissive: "#202020", // Slightly brighter emissive base
        emissiveIntensity: 0.5, // Increased from 0.2 to 0.5
        roughness: 0.2, // Smoother for more reflection
        metalness: 0.9, // More metallic
        clearcoat: 1.0, // Max clearcoat
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.0 // Stronger environment reflection
    };

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <mesh ref={ref} position={[0, 0, 0]}>
                <tubeGeometry args={[curve, 700, 0.2, 8, false]} />
                <meshPhysicalMaterial {...materialProps} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
                <tubeGeometry args={[curve, 700, 0.2, 8, false]} />
                <meshPhysicalMaterial {...materialProps} />
            </mesh>
        </group>
    );
};

// --- SCENE CONTROLLER (Identical to V53) ---
const SceneController = ({ progress, isScrolling }) => {
    const velocity = useRef(0);
    const hasTriggered = useRef(false);
    const acceleration = 2.0;
    const maxSpeed = 0.8;

    useFrame((state, delta) => {
        if (isScrolling.current && !hasTriggered.current) {
            hasTriggered.current = true;
        }
        const targetSpeed = hasTriggered.current ? maxSpeed : 0;
        velocity.current = THREE.MathUtils.lerp(velocity.current, targetSpeed, acceleration * delta);
        const current = progress.get();
        const next = Math.min(current + velocity.current * delta, 1);
        progress.set(next);
        const targetZ = 40 - next * 60;
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    });

    return null;
};

const LandingPage = () => {
    const router = useRouter();
    const progress = useMotionValue(0);
    const isScrolling = useRef(false);
    const scrollTimeout = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Visual Transitions
    const textOpacity = useTransform(progress, [0, 0.15], [1, 0]);
    const overlayOpacity = useTransform(progress, [0.8, 0.98], [0, 1]);
    const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Prefetch
        router.prefetch('/category');
    }, [router]);

    useEffect(() => {
        const unsubscribe = progress.on("change", (latest) => {
            if (latest >= 0.99) {
                router.push('/category');
            }
        });
        return () => unsubscribe();
    }, [router, progress]);

    const handleDiscoverClick = () => {
        isScrolling.current = true;
    };

    // Styles based on device
    const containerStyle = isMobile ? {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10,
        padding: '20px', boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    } : {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10,
        padding: '40px', boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
    };

    return (
        <>
            {/* 3D SCENE */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, background: '#000'
            }}>
                <Canvas camera={{ position: [0, 0, 40], fov: 75, near: 0.01 }}>
                    <color attach="background" args={['#000']} />
                    <fog attach="fog" args={['#000', 20, 90]} />
                    <ambientLight intensity={2.0} /> {/* Increased ambient light */}
                    <pointLight position={[10, 10, 10]} intensity={3} /> {/* Increased point light */}
                    <directionalLight position={[-5, 5, 5]} intensity={2} /> {/* Increased directional light */}
                    {/* <Environment preset="city" /> Removed for offline support */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <ThreadHelix />
                    </Float>
                    <SceneController progress={progress} isScrolling={isScrolling} />
                </Canvas>
            </div>

            {/* UI OVERLAY - RESPONSIVE & BALANCED */}
            <div style={containerStyle}>
                {/* BRANDING */}
                <motion.div style={{
                    opacity: textOpacity,
                    gridColumn: '1', gridRow: '1',
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    marginBottom: isMobile ? '20px' : 0
                }}>
                    <h2 style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontSize: isMobile ? '12px' : '14px',
                        letterSpacing: '2px',
                        color: '#fff',
                        margin: 0,
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(255,255,255,0.3)',
                        paddingBottom: '10px'
                    }}>
                        THE CURATOR
                    </h2>
                </motion.div>

                {/* HERO TEXT */}
                <motion.div style={{
                    opacity: textOpacity,
                    gridColumn: '1 / span 2', gridRow: '1 / span 2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isMobile ? 'center' : 'center',
                    alignItems: isMobile ? 'center' : 'flex-end',
                    textAlign: isMobile ? 'center' : 'right',
                    zIndex: 1,
                    flex: isMobile ? 1 : 'unset'
                }}>
                    <h1 style={{
                        fontFamily: "var(--font-syncopate), sans-serif",
                        fontSize: isMobile ? '15vw' : '12vw',
                        lineHeight: 0.85,
                        margin: 0,
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(255,255,255,0.8)',
                        letterSpacing: isMobile ? '-2px' : '-5px',
                        textTransform: 'uppercase'
                    }}>
                        WEEKLY
                    </h1>
                    <h1 style={{
                        fontFamily: "var(--font-syncopate), sans-serif",
                        fontSize: isMobile ? '15vw' : '12vw',
                        lineHeight: 0.85,
                        margin: 0,
                        color: '#fff',
                        letterSpacing: isMobile ? '-2px' : '-5px',
                        textTransform: 'uppercase',
                        marginRight: isMobile ? 0 : '10vw',
                        marginTop: isMobile ? '10px' : 0
                    }}>
                        DROPS
                    </h1>
                </motion.div>

                {/* BOTTOM SECTION */}
                <div style={isMobile ? { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px', gap: '20px' } : { display: 'contents' }}>

                    {/* VALUE PROP */}
                    <motion.div style={{
                        opacity: textOpacity,
                        gridColumn: '1', gridRow: '2',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        maxWidth: isMobile ? '90%' : '400px',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        {!isMobile && (
                            <p style={{
                                fontFamily: "var(--font-manrope), sans-serif",
                                fontSize: '18px',
                                color: '#fff',
                                margin: '0 0 20px 0',
                                fontWeight: '300',
                                lineHeight: 1.4,
                                letterSpacing: '0.5px'
                            }}>
                                NO SCROLLING.<br />JUST STYLE.
                            </p>
                        )}

                        <p style={{
                            fontFamily: "var(--font-manrope), sans-serif",
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                            margin: 0,
                            lineHeight: 1.6,
                            letterSpacing: '0.5px'
                        }}>
                            We curate complete outfits from your favorite brands.
                            Simply click to shop the look.
                        </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div style={{
                        opacity: textOpacity,
                        gridColumn: '2', gridRow: '2',
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'flex-end',
                        alignItems: 'flex-end',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <button
                            onClick={handleDiscoverClick}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.5)',
                                color: '#fff',
                                fontFamily: "var(--font-manrope), sans-serif",
                                fontSize: isMobile ? '14px' : '14px',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: isMobile ? '15px 40px' : '15px 30px',
                                borderRadius: isMobile ? '30px' : '0px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {isMobile ? 'DISCOVER' : 'DISCOVER COLLECTION'} <span style={{ fontSize: '18px' }}>→</span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', zIndex: 20
            }}>
                <motion.div style={{
                    width: progressWidth, height: '100%', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }} />
            </div>

            {/* FADE TRANSITION OVERLAY */}
            <motion.div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#ECEAE5', zIndex: 50, opacity: overlayOpacity, pointerEvents: 'none'
                }}
            />

            <style>{`
        body { margin: 0; background: #000; overflow: hidden; }
      `}</style>
        </>
    );
};

export default LandingPage;
