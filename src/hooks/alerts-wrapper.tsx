"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AlertWrapper({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();


    const toastMessage = searchParams.get('toastMessage');
    const toastType = searchParams.get('toastType');
    const valid = searchParams.get('valid');

    useEffect(() => {
        if (valid || toastMessage || toastType) {
            const timeout = setTimeout(() => {
                router.push('?')
            }, 5000);
            return () => clearTimeout(timeout)
        }

    })

    return (
        <>
            {/* Show toast based on response */}
            {toastMessage && (
                <ToastProvider key={pathname} label={pathname}>
                    <Toast className='border rounded-lg p-4 text-lg animate-bounce animate-in duration-500 border-white'>
                        <div className={`toast-${toastType}`}>
                            <ToastTitle className={toastType === 'success' ? 'text-green-500' : 'text-red-500'}>{toastType === 'success' ? 'Success' : 'Error'}</ToastTitle>
                            {toastMessage && <ToastDescription>{toastMessage}</ToastDescription>}
                        </div>
                        <ToastClose className='dark:text-white' />
                    </Toast>
                    <ToastViewport />
                </ToastProvider>
            )}

            {children}
        </>
    );
}
