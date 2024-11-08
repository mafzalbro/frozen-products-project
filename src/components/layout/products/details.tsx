"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchProductBySlug } from "@/actions/products";
import Image from "next/image";
import { FrozenProduct } from "@/types";

const ProductDetails = ({ params: { slug } }: { params: { slug: string } }) => {
    const [product, setProduct] = useState<FrozenProduct | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch product details based on the slug
    const loadProduct = useCallback(async () => {
        setLoading(true);
        const data = await fetchProductBySlug(slug); // Make sure this returns the right shape of data
        setProduct(data);
        setLoading(false);
    }, [slug]); // Memoize loadProduct to avoid recreating the function on every render

    useEffect(() => {
        if (slug) {
            loadProduct();
        }
    }, [slug, loadProduct]); // Include loadProduct in the dependency array

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-4">{product.description}</p>
            <p className="mt-2">Price: ${product.price}</p>
            <p className="mt-2">Category: {product.category}</p>
            {product.image_url &&
                <Image
                    height={360}
                    width={640}
                    src={product.image_url} // Ensure this matches the field name
                    alt={product.name}
                    className="w-full h-auto mt-4 rounded-lg"
                />}
        </div>
    );
};

export default ProductDetails;
