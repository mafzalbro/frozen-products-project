"use client";

import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import GoBack from "@/components/layout/main/goback";
import CartDrawer from "@/components/layout/cart/drawer";

const CartPage = () => {
  const { cart, removeFromCart, loading } = useCart(); // Assume loading is a boolean indicating if data is still being fetched

  // Calculate the total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 my-2">
      <GoBack link="/products">
        See Products
      </GoBack>
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {loading ? (
        <div>
          {/* Render Skeletons when loading */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="mb-4 p-4 flex justify-between items-center h-24 w-full" />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} className="mb-6 p-4 flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <Link href={`/products/${item.slug}`}>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                </Link>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                <MdDelete /> Remove
              </Button>
            </Card>
          ))}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Total Amount: ${totalAmount.toFixed(2)}</h2>
            <Link href="/checkout" passHref>
              <Button className="mt-4">Proceed to Checkout</Button>
            </Link>
          </div>
          <CartDrawer />
        </>
      )}
    </div>
  );
};

export default CartPage;
