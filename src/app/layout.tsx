import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css";

import Navbar from "@/components/layout/navbar/navbar";
import { getMeta } from "@/store/metadata";
import { CartProvider } from "@/hooks/cart-context";
import Footer from "@/components/layout/footer/footer";
import Breadcrumbs from "@/components/layout/main/breadcrumbs";
import AlertWrapper from "@/hooks/alerts-wrapper";
import { Suspense } from "react";
import ProgressBarProviders from "@/components/theme/progress";
// import ThreeDotsSpinner from "@/components/layout/spinners/three-dots";
import Loader from "@/components/layout/spinners/Loader";

const outfit = localFont({
  src: "./fonts/Outfit.ttf",
  variable: "--font-outfit",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: getMeta().siteTitle,
  description: getMeta().description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} overflow-x-hidden w-full max-w-screen-xl mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {/* <section className="max-w-screen-xl"> */}
            <ProgressBarProviders>
              <div className="mb-8">
                <Navbar />
              </div>
              <div>
                <Breadcrumbs />
                {/* <Suspense fallback={<div className="text-center my-72">Loading <ThreeDotsSpinner /></div>}> */}
                <Suspense fallback={<Loader />}>
                  <AlertWrapper>
                    {children}
                  </AlertWrapper>
                </Suspense>
              </div>
              <Toaster />
              {/* </section> */}
              <Footer />
            </ProgressBarProviders>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
