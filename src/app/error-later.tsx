'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className='my-60 text-center max-w-xl mx-auto w-full'>
            <h2 className='text-2xl mb-6'>Something went wrong!</h2>
            <Button
                onClick={
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}