"use client"

import { Button } from '@/components/ui/button';
import { ReactNode, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';

export default function SubmitButton({ children }: { children: ReactNode }) {
    const { pending } = useFormStatus();
    const form = useForm()

    useEffect(() => {
        const timeout = setTimeout(() => {
            form.reset()
        }, 5000);
        return () => clearTimeout(timeout)

    })

    return (
        <>
            <Button type="submit" disabled={pending}>
                {pending ? 'Submitting...' : children}
            </Button>

        </>
    );
}
