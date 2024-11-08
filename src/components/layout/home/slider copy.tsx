'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FrozenProduct } from '@/types';
import { fetchProducts } from '@/actions/products';

const ProductCarousel = () => {
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
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

    useEffect(() => {
        // Check if Swiper has loaded
        const handleLoad = () => setHasLoaded(true);
        if (typeof window !== 'undefined') {
            window.addEventListener('DOMContentLoaded', handleLoad);
        }
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    if (loading && products?.length === 0) {
        return (
            <section className="my-16 py-8 px-4 overflow-hidden">
                <h2 className="text-3xl font-bold text-center">Top Frozen Products</h2>
                <div className="flex space-x-4 mt-6 overflow-x-auto w-full">
                    {Array.from({ length: 2 }).map((_, index: number) => (
                        <Skeleton
                            key={index}
                            className="h-72 w-full sm:w-1/2 rounded-lg border"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        products && (
            <section className="my-16 py-8 px-4 overflow-hidden">
                <h2 className="text-3xl font-bold text-center">Top Frozen Products</h2>

                {/* Check if Swiper has loaded */}
                {!hasLoaded ? (
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={products[0]?.image_url || "/placeholders/no-image.png"}
                            alt={products[0]?.name || "No image"}
                            width={640}
                            height={360}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="mt-4 p-4">
                            <h3 className="text-xl font-bold">{products[0]?.name}</h3>
                            {products[0]?.category && <p>{products[0]?.category}</p>}
                            <p className="text-blue-500 dark:text-blue-300 mt-2">${products[0]?.price}</p>
                        </div>
                    </div>
                ) : (
                    <Swiper
                        effect="coverflow"
                        spaceBetween={30}
                        coverflowEffect={{
                            rotate: 20,
                            depth: 50,
                        }}
                        loop={true}
                        speed={2000}
                        centeredSlides={true}
                        autoplay={{
                            delay: 500,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay, EffectCoverflow]}
                        className="mt-6"
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: products?.length < 2 ? 3 : 2 },
                            1024: { slidesPerView: products?.length < 3 ? 4 : 3 },
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="rounded-lg overflow-hidden hover:scale-95 duration-200">
                                    <Image
                                        src={product.image_url || "/placeholders/no-image.png"}
                                        alt={product.name || "No image"}
                                        width={640}
                                        height={360}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div className="mt-4 p-4">
                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                        {product.category && <p>{product.category}</p>}
                                        <p className="text-blue-500 dark:text-blue-300 mt-2">${product.price}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>
        )
    );
};

export default ProductCarousel;
