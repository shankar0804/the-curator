"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const LandingPage = dynamic(() => import('./LandingPage'), {
    ssr: false,
    loading: () => (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'sans-serif',
            letterSpacing: '2px'
        }}>
            LOADING EXPERIENCE...
        </div>
    )
});

export default function LandingPageWrapper() {
    return <LandingPage />;
}
