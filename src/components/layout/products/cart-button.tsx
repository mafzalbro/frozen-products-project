"use client";

import { useState } from "react";
import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FrozenProduct } from "@/types";
import Link from "next/link";
import { TbShoppingCartPlus, TbShoppingCartShare } from "react-icons/tb";

interface AddToCartProps {
    product: FrozenProduct;
    main?: boolean;
}

const AddToCart = ({ product, main }: AddToCartProps) => {
    const { addToCart, cart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    // Check if the product is already in the cart
    const isInCart = cart.some((item) => item.id === product.id);

    const handleAddToCart = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate quantity
        if (quantity < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        setError(""); // Clear any previous error
        addToCart({
            id: product.id || 1,
            name: product.name,
            price: product.price || 10000,
            image_url: product.image_url || '',
            quantity,
            slug: product.slug || "no-slug",
        });
    };

    const handleIncrease = () => setQuantity((prev) => prev + 1);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <form onSubmit={handleAddToCart} className="mt-2 flex items-end justify-between gap-2">
            {!main ? (
                <>
                    <div className="flex flex-col gap-1">
                        <Label className="mr-2 text-sm">Quantity:</Label>
                        <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                                const value = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
                                setQuantity(value);
                            }}
                            className="border rounded-md w-16 px-2"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
                    </div>
                    {!isInCart ? (
                        <Button type="submit" className="px-4 rounded-md">
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="flex gap-1">
                            <Link href={`/cart#${product.slug}`} passHref>
                                <Button className="px-4 rounded-md" variant={"outline"}>
                                    <TbShoppingCartShare size={24} />
                                </Button>
                            </Link>
                            <Button type="submit" className="px-4 rounded-md">
                                <TbShoppingCartPlus size={24} />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex items-center mt-4">
                        <Button
                            type="button"
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                            className="flex-shrink-0"
                        >
                            -
                        </Button>
                        <span className="mx-4 text-lg">{quantity}</span>
                        <Button
                            type="button"
                            onClick={handleIncrease}
                            className="flex-shrink-0"
                        >
                            +
                        </Button>
                    </div>
                    {isInCart ? (
                        <div className="flex gap-2">
                            <Link href={`/cart#${product.slug}`} passHref>
                                <Button type="button" className="px-4 rounded-md" variant={"outline"}>
                                    View in Cart
                                </Button>
                            </Link>
                            <Button type="submit" className="px-4 rounded-md" onClick={handleAddToCart}>
                                Add to Cart
                            </Button>
                        </div>
                    ) : (
                        <Button type="button" className="px-4 rounded-md" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    )}
                </>
            )}
        </form>
    );
};

export default AddToCart;
