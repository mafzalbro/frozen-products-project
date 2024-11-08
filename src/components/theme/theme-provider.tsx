"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import Lenis from 'lenis'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {


    React.useEffect(() => {
        if (window !== undefined) {
            const lenis = new Lenis();
            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }, [])

    return <>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
}
