import React from 'react'
import { BiSad } from 'react-icons/bi'

const NotFoundPart = ({ children, className, short }: { children: React.ReactNode, className?: string, short?: boolean }) => {
    return (
        <div className={`flex justify-center items-center flex-col gap-4 border rounded-lg ${short ? "h-40 my-6 mx-0" : "h-80 my-20 mx-6"} ${className}`}>
            <BiSad className='text-4xl text-red-600 dark:text-red-500' />
            <span>
                {children}
            </span>
        </div>
    )
}

export default NotFoundPart