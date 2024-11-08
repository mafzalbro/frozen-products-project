"use client";

import { verifyRegisteredUser } from '@/actions/auth';
import ThreeDotsSpinner from '@/components/layout/spinners/three-dots';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdSad } from 'react-icons/io';

const VerifyRegisterUser = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                const result = await verifyRegisteredUser(token);
                setLoading(false);
                // Redirect based on the result
                const message = result.success
                    ? "🎉 Your email has been verified successfully!"
                    : result.message || "❌ Verification failed!";

                    
                // Using router.push for redirection
                await router.push(`/?toastMessage=${encodeURIComponent(message)}&toastType=${result.success ? 'success' : 'error'}`);
            } else {
                await router.push(`/?toastMessage=${encodeURIComponent("🔒 No token provided!")}&toastType=error`);
            }
        };

        verifyUser();
    }, [token, router]);

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen">
                <IoMdSad />
                <div>Token Not There</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="font-bold">Checking your email<ThreeDotsSpinner /></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <h2 className="font-bold">Verifying your email  <ThreeDotsSpinner /></h2>
        </div>
    );
};

export default VerifyRegisterUser;
