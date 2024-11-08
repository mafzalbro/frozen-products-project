"use client"

import React, { useState, useEffect, use } from 'react';
import { fetchUserOrderById } from '@/actions/orders';
import { Order } from '@/types';
import GoBack from '@/components/layout/main/goback';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const OrderDetailPage = (props: { params: Promise<{ orderId: string }> }) => {
    const params = use(props.params);

    const {
        orderId
    } = params;

    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            const fetchedOrder = await fetchUserOrderById(parseInt(orderId));
            setOrder(fetchedOrder);
            setLoading(false);
        };

        loadOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="p-6">
                <GoBack link='/orders'>
                    See All Orders
                </GoBack>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Card className="mt-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!order) {
        return <div className="p-6">Order not found or you do not have permission to view this order.</div>;
    }

    return (
        <div className="p-6">
            <GoBack link='/orders'>
                See All Orders
            </GoBack>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <Card className="mt-4">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                </CardHeader>
                <CardContent>
                    <p>Customer Name: {order.customerName}</p>
                    <p>Status: {order.status}</p>
                    <p>Total: ${order.totalAmount}</p>
                    {order?.createdAt && <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>}
                </CardContent>
                <CardFooter>
                    <Button variant="default" onClick={() => alert('Order actions coming soon!')}>Take Action</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default OrderDetailPage;
