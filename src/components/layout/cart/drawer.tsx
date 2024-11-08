"use client";

import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { MdDelete } from "react-icons/md";
import Link from "next/link";

const CartDrawer = ({ isOpen, onOpenChange }: { isOpen?: boolean; onOpenChange?: (open: boolean) => void; }) => {
    const { cart, removeFromCart } = useCart();

    // Calculate the total amount
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Drawer open={isOpen} defaultOpen onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="relative">
                    <DrawerClose asChild className="absolute right-10 top-10 inline-block">
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                    <div className="max-w-lg mx-auto max-h-screen overflow-y-auto">
                        <DrawerHeader>
                            <DrawerTitle>Your Cart</DrawerTitle>
                        </DrawerHeader>
                        {cart.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <Card key={item.id} className="mb-4 p-4 flex justify-between items-center">
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
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">Total Amount: ${totalAmount.toFixed(2)}</h2>
                                    <Link href="/checkout" passHref>
                                        <Button className="mt-4 w-full">Proceed to Checkout</Button>
                                    </Link>
                                </div>
                            </>
                        )}
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline" className="w-full">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CartDrawer;
