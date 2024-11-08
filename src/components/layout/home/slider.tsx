'use client';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, EffectCoverflow } from 'swiper/modules';
// import 'swiper/swiper-bundle.css';
// import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FrozenProduct } from '@/types';
import { fetchProducts } from '@/actions/products';
import ProductCard from '../products/cards';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ProductCarousel = () => {
    const [loading, setLoading] = useState(true);
    // const [hasLoaded, setHasLoaded] = useState(false);
    const [products, setProducts] = useState<FrozenProduct[] | undefined>([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const { products: productsData } = await fetchProducts({});
                setProducts(productsData);
            } catch (error) {
                console.log({ error });
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    // useEffect(() => {
    //     // Check if Swiper has loaded
    //     const handleLoad = () => setHasLoaded(true);
    //     if (typeof window !== 'undefined') {
    //         window.addEventListener('DOMContentLoaded', handleLoad);
    //     }
    //     return () => window.removeEventListener('load', handleLoad);
    // }, []);

    if (loading && products?.length === 0) {
        return (
            <section className="my-8 mt-4 md:mb-10 py-8 overflow-hidden">
                <h2 className="text-3xl font-bold text-center">Top Frozen Products</h2>
                <div className="flex mt-6 overflow-x-auto w-full flex-wrap px-4">
                    <Skeleton className="h-72 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg border" />
                    <Skeleton className="h-72 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg border" />
                    <Skeleton className="h-72 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg border" />
                    <Skeleton className="h-72 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg border" />
                </div>
            </section>
        );
    }

    return (
        products?.length !== 0 ? <section className="mb-8 mt-4 md:mb-10 py-8 px-4 overflow-hidden">
            <h2 className="text-3xl font-bold text-center mb-10">Top Frozen Products</h2>
            <div className='flex flex-wrap'>
                {products?.map(product =>
                    < ProductCard key={product.id} product={product} noDescription />
                )}
            </div>
            <div className='flex justify-center mt-10'>
                <Link href={"/products"}>
                    <Button>
                        See Products
                    </Button>
                </Link>
            </div>
        </section> : null
    );
};

export default ProductCarousel;
