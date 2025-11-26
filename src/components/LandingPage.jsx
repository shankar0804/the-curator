"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, useTexture, Environment } from '@react-three/drei';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

// Assets
const threadTexture = "/assets/silver_thread_texture.png";

// --- NEON HELIX COMPONENT (INTERMEDIATE LENGTH) ---
const ThreadHelix = (props) => {
    const ref = useRef();
    const texture = useTexture(threadTexture);

    // Configure texture for wrapping
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 2);

    // Create a smooth curve for the tube
    const curve = useMemo(() => {
        const points = [];
        const count = 100;

        for (let i = 0; i <= count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 16; // Intermediate turns (was 12 in V47, 20 in V46)
            const radius = 3;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            // INTERMEDIATE LENGTH: 80 units (was 60 in V47, 100 in V46)
            // Range: -20 to 60 (Camera starts at 40, moves in)
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
        color: "#e8e8e8",
        emissive: "#000000",
        emissiveIntensity: 0,
        roughness: 0.4,
        metalness: 0.8,
        clearcoat: 0.5,
        clearcoatRoughness: 0.4,
        envMapIntensity: 1.2
    };

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <mesh ref={ref} position={[0, 0, 0]}>
                <tubeGeometry args={[curve, 700, 0.2, 8, false]} />
                <meshPhysicalMaterial {...materialProps} />
            </mesh>
            {/* Second strand */}
            <mesh rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
                <tubeGeometry args={[curve, 700, 0.2, 8, false]} />
                <meshPhysicalMaterial {...materialProps} />
            </mesh>
        </group>
    );
};

// --- SCENE CONTROLLER (FASTER PHYSICS) ---
const SceneController = ({ progress, isScrolling }) => {
    const velocity = useRef(0);
    const hasTriggered = useRef(false);

    // FASTER SETTINGS (Same as V47)
    const acceleration = 2.0;
    const maxSpeed = 0.8;

    useFrame((state, delta) => {
        // 1. Detect Start
        if (isScrolling.current && !hasTriggered.current) {
            hasTriggered.current = true;
        }

        // 2. Determine Target Speed
        const targetSpeed = hasTriggered.current ? maxSpeed : 0;

        // 3. Apply Velocity
        velocity.current = THREE.MathUtils.lerp(velocity.current, targetSpeed, acceleration * delta);

        const current = progress.get();
        const next = Math.min(current + velocity.current * delta, 1);
        progress.set(next);

        // 4. Camera Movement
        // Start at 40 (Entrance)
        // Move to -20 (Exit)
        // Total Travel: 60 units
        const targetZ = 40 - next * 60;
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    });

    return null;
};

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
            {/* 3D SCENE */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                background: '#000'
            }}>
                <Canvas camera={{ position: [0, 0, 40], fov: 75, near: 0.01 }}>
                    <color attach="background" args={['#000']} />
                    <fog attach="fog" args={['#000', 20, 90]} />

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <ThreadHelix />
                        </Float>
                    </Suspense>

                    <SceneController progress={progress} isScrolling={isScrolling} />
                </Canvas>
            </div>

            {/* UI OVERLAY */}
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
                        fontFamily: "'Syncopate', sans-serif",
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
                            fontFamily: "'Syncopate', sans-serif",
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
                            fontFamily: "'Syncopate', sans-serif",
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
                    opacity: textOpacity, // Fixed: Removed duplicate opacity key
                    fontFamily: "'Syncopate', sans-serif",
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
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
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
