"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast"; // Ensure correct import path
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import { ShoppingCart, Trash } from "lucide-react"; // Add icons for better visual cues

type CartItem = {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    slug: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    loading: boolean;
    cartItemsCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            return storedCart ? JSON.parse(storedCart) : [];
        }
        return [];
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoading(false);
            const storedCart = localStorage.getItem("cart");
            setCart(storedCart ? JSON.parse(storedCart) : []);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoading(false);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setLoading(true);
        setCart((prev) => {
            const existingItem = prev.find((i) => i.id === item.id);
            if (existingItem) {
                const updatedCart = prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
                toast({
                    variant: "default",
                    title: `${item.name} Updated!`,
                    description: (
                        <div className="flex items-center space-x-4">
                            <ShoppingCart className="text-green-500" />
                            <p>Quantity increased to {existingItem.quantity + item.quantity}.</p>
                            <Link href={`/cart#${existingItem.slug}`} passHref>
                                <ToastAction altText="See Cart" className="px-2 inline-block text-xs">
                                    See Cart
                                </ToastAction>
                            </Link>
                        </div>
                    ),
                });
                setLoading(false);
                return updatedCart;
            }
            toast({
                variant: "default",
                title: `${item.name} Added!`,
                description: (
                    <div className="flex items-center space-x-4">
                        <ShoppingCart className="text-green-500" />
                        <p>{item.name} has been added to your cart!</p>
                        <Link href={`/cart#${item.slug}`} passHref>
                            <ToastAction altText="See Cart" className="px-2 inline-block text-xs">
                                See Cart
                            </ToastAction>
                        </Link>
                    </div>
                ),
            });
            setLoading(false);
            return [...prev, item];
        });
    };

    const removeFromCart = (id: number) => {
        setLoading(true);
        setCart((prev) => {
            const itemToRemove = prev.find((item) => item.id === id);
            if (itemToRemove) {
                toast({
                    variant: "destructive",
                    title: `${itemToRemove.name} Removed!`,
                    description: (
                        <div className="flex items-center justify-between space-x-4">
                            <Trash className="text-red-500" />
                            <p>{itemToRemove.name} has been removed from your cart.</p>
                            <Link href="/products" passHref>
                                <ToastAction altText="See Cart" className="px-2 inline-block text-xs">
                                    See Products
                                </ToastAction>
                            </Link>
                        </div>
                    ),
                });
            }
            setLoading(false);
            return prev.filter((item) => item.id !== id);
        });
    };

    return (
        <CartContext.Provider value={{ cart, cartItemsCount: cart.length, addToCart, removeFromCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
