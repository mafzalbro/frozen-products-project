import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Home, LogIn, Store } from 'lucide-react'
import { IoSadOutline } from 'react-icons/io5'

const NotFoundComponent = async () => {
    const headersList = await headers()
    const domain = headersList.get('referer')
    return (
        <div className='h-96 flex flex-col justify-center items-center text-center max-w-xl mx-auto w-full space-y-6 my-24'>
            <h1 className='text-4xl'>
                <span className='flex gap-2 justify-center items-center'>
                    <IoSadOutline className='text-red-600 dark:text-red-500' /> Not Found
                </span>
            </h1>
            {domain ? <h2 className='border rounded-lg py-2 px-4 text-sm'><span className='font-bold antialiased'>URL: </span><span>{domain}</span></h2> : ""}
            <p>Could not find requested resource !!!</p>
            <div>
                <Button>
                    <Home />
                    <Link href="/" className='text-blue-100 dark:text-blue-600'>Home</Link>
                </Button>
                <Button className='ml-2'>
                    <Store />
                    <Link href="/products" className='text-blue-100 dark:text-blue-600 p-0'>View Products</Link>
                </Button>
                <Button variant={'secondary'} className='ml-2'>
                    <LogIn />
                    <Link href="/login" className='p-0'>Login</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFoundComponent