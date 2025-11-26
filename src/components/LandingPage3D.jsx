"use client";

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, useTexture, Environment } from '@react-three/drei';
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

const LandingPage3D = ({ progress, isScrolling }) => {
    return (
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
    );
};

export default LandingPage3D;
