"use client"

import { usePathname } from "next/navigation";

const FooterWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const notAllowedPaths = ['/user', '/admin']
    if (!notAllowedPaths.some((path) => pathname.includes(path)))
        return (
            <>
                {children}
            </>
        );
};

export default FooterWrapper;
