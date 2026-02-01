"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Truck, CookingPot, XCircle, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { ordersAPI } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const ORDER_STATUSES = [
    "PENDING",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
] as const;

type OrderStatus =
    | "PENDING"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

const statusIcons: Record<OrderStatus, any> = {
    PENDING: Clock,
    PREPARING: CookingPot,
    OUT_FOR_DELIVERY: Truck,
    DELIVERED: CheckCircle,
    CANCELLED: XCircle,
};

interface Order {
    id: string;
    status: string;
    createdAt: string;
}

export default function Page() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchOrders = async () => {
        try {
            const data = await ordersAPI.getUserOrders() as Order[];
            setOrders(data);
            if (data.length > 0 && !selectedOrderId) {
                setSelectedOrderId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;

        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        setIsCancelling(true);
        try {
            await ordersAPI.updateStatus(selectedOrderId, "CANCELLED");
            toast.success("Order cancelled successfully");
            fetchOrders(); // Refresh orders to get updated status
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel order");
        } finally {
            setIsCancelling(false);
        }
    };

    useEffect(() => {
        if (!authPending && session) {
            fetchOrders();
        } else if (!authPending && !session) {
            setIsLoading(false);
        }
    }, [session, authPending]);

    const currentOrder = orders.find(o => o.id === selectedOrderId);
    const status = (currentOrder?.status || "PENDING") as OrderStatus;
    const currentStep = ORDER_STATUSES.indexOf(status as any);
    const canCancel = status === "PENDING" || status === "PREPARING";

    if (authPending || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Fetching your orders...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Please login to track orders</h2>
                <Link href="/login">
                    <Button className="mt-4">Login Now</Button>
                </Link>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-muted p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-2">No orders found</h2>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                    You haven't placed any orders yet. Start your culinary journey today!
                </p>
                <Link href="/meals">
                    <Button size="lg" className="rounded-full">Browse Meals</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-14">
            <div className="container max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
                    <p className="text-muted-foreground mt-2">
                        Follow your food from kitchen to doorstep 🍔
                    </p>
                </div>

                {/* Order Selector */}
                <div className="mb-10 flex flex-col items-center gap-4">
                    <label htmlFor="order-selector" className="text-sm font-medium text-muted-foreground">
                        Select an order to track:
                    </label>
                    <select
                        id="order-selector"
                        value={selectedOrderId}
                        onChange={(e) => setSelectedOrderId(e.target.value)}
                        className="w-full max-w-xs rounded-lg border bg-background px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition"
                    >
                        {orders.map((order) => (
                            <option key={order.id} value={order.id}>
                                Order #{order.id.slice(-8).toUpperCase()} - {new Date(order.createdAt).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tracking View */}
                <div className="relative">
                    {status === "CANCELLED" ? (
                        <div className="flex flex-col items-center rounded-2xl bg-background p-12 shadow-xl border border-destructive/10 animate-in fade-in zoom-in duration-300">
                            <div className="bg-red-50 p-4 rounded-full mb-6">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-600">Order Cancelled</h2>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Progress Bar Container */}
                            <div className="bg-background rounded-2xl p-8 shadow-xl border border-primary/5">
                                <div className="relative flex items-center justify-between pb-4">
                                    {ORDER_STATUSES.map((step, index) => {
                                        const Icon = statusIcons[step];
                                        const isCompleted = index <= currentStep;
                                        const isCurrent = index === currentStep;

                                        return (
                                            <div
                                                key={step}
                                                className="relative z-10 flex flex-col items-center gap-3"
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500",
                                                        isCompleted
                                                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                                                            : "border-muted bg-background text-muted-foreground",
                                                        isCurrent && "ring-4 ring-primary/20 scale-110"
                                                    )}
                                                >
                                                    <Icon className={cn("h-6 w-6", isCurrent && "animate-pulse")} />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span
                                                        className={cn(
                                                            "text-xs font-bold uppercase tracking-wider",
                                                            isCompleted ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        {step.replaceAll("_", " ")}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="absolute left-8 right-8 top-7 h-1 bg-muted z-0">
                                        <div
                                            className="h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-700 ease-in-out"
                                            style={{
                                                width: `${(Math.max(0, currentStep) / (ORDER_STATUSES.length - 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cancel Button Section */}
                            {canCancel && (
                                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="font-semibold text-red-900 text-sm">Changed your mind?</p>
                                            <p className="text-red-700/70 text-xs">You can cancel your order until it's out for delivery.</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={handleCancelOrder}
                                        disabled={isCancelling}
                                        className="w-full sm:w-auto shadow-lg shadow-red-200"
                                    >
                                        {isCancelling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : (
                                            "Cancel Order"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

