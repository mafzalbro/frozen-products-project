"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import GoBack from "@/components/layout/main/goback";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RiDeleteBinFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import "./cart.css"

const CartPage = () => {
  const { cart, removeFromCart, loading } = useCart();
  const highlightedRef = useRef<HTMLElement | null>(null);

  // Calculate the total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const hash = window.location.hash.slice(1); // Get the hash without '#'

    if (hash && cart.length > 0) {
      const itemToHighlight = cart.find((item) => item.slug === hash);

      if (itemToHighlight) {
        highlightedRef.current = document.getElementById(`cart-item-${itemToHighlight.id}`);

        if (highlightedRef.current) {
          highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

          // Apply delayed "vibration" effect twice
          setTimeout(() => {
            highlightedRef.current?.classList.add("vibrate");
            setTimeout(() => {
              highlightedRef.current?.classList.remove("vibrate");
            }, 1000);
          }, 300);
        }

        // Clear hash from URL after 5 seconds
        setTimeout(() => {
          window.history.replaceState(null, "", " ");
        }, 5000);
      }
    }
  }, [cart]);

  return (
    <div className="max-w-2xl mx-auto p-6 my-2">
      <GoBack link="/products">See Products</GoBack>
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {loading ? (
        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="mb-4 p-4 flex justify-between items-center h-36 w-full" />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card
              key={item.id}
              id={`cart-item-${item.id}`}
              className="mb-6 sm:p-4 flex justify-between items-center gap-4 shadow-lg relative"
            >
              <div>
                <Image src={item?.image_url} alt={item.name} height={360} width={640} className="w-32 h-32 rounded-lg border object-cover" />
              </div>
              <div className="flex flex-col gap-4 p-4 flex-1 items-start">
                <Link href={`/products/${item.slug}`}>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                </Link>
                <div className="flex flex-wrap gap-3">
                  <Badge>${Number(item?.price)?.toFixed(2)}</Badge>
                  <div>Quantity:<Badge variant={"secondary"} className="ml-1">{item.quantity}</Badge>
                  </div>
                </div>
              </div>
              <Button className="absolute -right-2 -top-2 sm:relative" variant="destructive" onClick={() => removeFromCart(item.id)}>
                <RiDeleteBinFill />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </Card>
          ))}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">
              Total Amount:{" "}
              <Badge variant={"secondary"} className="text-xl border">
                ${totalAmount.toFixed(2)}
              </Badge>
            </h2>
            <Link href="/checkout" passHref>
              <Button className="mt-4 text-lg py-5">
                Proceed to Checkout <IoIosArrowForward />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
