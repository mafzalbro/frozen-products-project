"use client"

import {
    checkPageAccess,
    restrictPageAccess
} from "@/actions/helpers/check-access";
import Loader from "@/components/layout/spinners/Loader";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const CheckPriviledges = ({ children }: { children: ReactNode }) => {
    const [pageLoading, setPageLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const check = async () => {
            try {
                await restrictPageAccess(pathname)
                const hasAccess = await checkPageAccess(pathname);
                if (!hasAccess) {
                    router.replace('/admin')
                }
                setPageLoading(false)

            } catch (error: unknown) {
                const customError = JSON.parse(JSON.stringify(error))
                if (customError?.digest === "NEXT_NOT_FOUND") {
                    router.replace('/admin')
                    if (pathname === "/admin") {
                        setPageLoading(false)
                    }
                }
            }
        }

        check()
    }, [pathname, router])
    if (pageLoading) {
        return <Loader text="Checking" />
    }
    return <>
        {children}
    </>
}

export default CheckPriviledges