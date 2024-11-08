"use client"
import React, { useState, useEffect } from 'react';
import { fetchUserOrders } from '@/actions/orders';
import { Order } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Ensure you import the Skeleton component

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            const { orders } = (await fetchUserOrders({}));
            setOrders(orders);
            setLoading(false);
        };

        loadOrders();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Your Orders</h1>
            <p className="mt-4">Here are your orders:</p>
            <div className="grid grid-cols-1 gap-6 mt-6">
                {loading ? (
                    // Display skeletons while loading
                    <>
                        {[...Array(3)].map((_, index) => (
                            <Card key={index} className="shadow-md">
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
                        <Card key={order.id} className="shadow-md">
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                            </CardHeader>
                            <CardContent>
                                <p>Customer Name: {order.customerName}</p>
                                <p>Status: {order.status}</p>
                                <p>Total: ${order.totalAmount}</p>
                                <Link href={`/orders/${order.id}`} className="text-blue-500 hover:underline">View Details</Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
