// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { MdShoppingCart } from "react-icons/md";
import GoBack from "@/components/layout/main/goback";
import CartDrawer from "@/components/layout/cart/drawer";


const CartPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { cart } = useCart();

  // Automatically open the drawer if the cart has items
  useEffect(() => {
    if (cart.length > 0) {
      setIsDrawerOpen(true);
    }
  }, [cart]);

  return (
    <div className="max-w-3xl mx-auto p-6 my-2">
      <GoBack link="/products">See Products</GoBack>
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items to your cart.</p>
      ) : (
        <Button onClick={() => setIsDrawerOpen(true)} variant="outline">
          <MdShoppingCart className="mr-2" /> Open Cart
        </Button>
      )}
      <CartDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  );
};

export default CartPage;
