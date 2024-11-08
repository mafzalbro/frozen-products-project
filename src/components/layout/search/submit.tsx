"use client"

import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { HiOutlineSearch } from 'react-icons/hi'

const SubmitSearchButton = () => {
    const { pending } = useFormStatus()
    return (<Button
        disabled={pending}
        type="submit"
        className="absolute right-0 -top-0.5 bottom-0 py-6 pb-7 px-8 text-white rounded-full"
    >
        {pending ? <Loader className='animate-spin' /> : <HiOutlineSearch size={20} />}
    </Button>
    )
}

export default SubmitSearchButton