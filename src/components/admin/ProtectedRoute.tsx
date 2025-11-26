"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/admin/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!authService.isAuthenticated()) {
                router.push('/admin/login');
            } else {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isChecking) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'sans-serif'
            }}>
                Checking authentication...
            </div>
        );
    }

    return <>{children}</>;
}
