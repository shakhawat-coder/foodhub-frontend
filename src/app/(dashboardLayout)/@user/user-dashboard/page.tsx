"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { ordersAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Loader2
} from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';

export default function UserDashboardPage() {
    const { data: session, isPending: authLoading } = authClient.useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        delivered: 0
    });

    useEffect(() => {
        const fetchOrders = async () => {
            if (session?.user) {
                try {
                    const data: any = await ordersAPI.getUserOrders();
                    const ordersArray = Array.isArray(data) ? data : [];
                    setOrders(ordersArray);

                    setStats({
                        total: ordersArray.length,
                        pending: ordersArray.filter((o: any) => o.status === "PENDING" || o.status === "PREPARING" || o.status === "ON_THE_WAY").length,
                        delivered: ordersArray.filter((o: any) => o.status === "DELIVERED").length
                    });
                } catch (error) {
                    console.error("Failed to fetch user orders:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (!authLoading) {
            fetchOrders();
        }
    }, [session, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const user = session?.user;

    const statCards = [
        {
            title: "Total Orders",
            value: stats.total,
            icon: ShoppingBag,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "Orders placed so far"
        },
        {
            title: "Active Orders",
            value: stats.pending,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "Orders in progress"
        },
        {
            title: "Delivered",
            value: stats.delivered,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "Successfully received"
        }
    ];

    return (
        <div className="space-y-8 p-4 md:p-6">
            {/* Header section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    User Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Track your orders and manage your profile.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Orders List */}
                <Card className="lg:col-span-2 shadow-sm border-muted/60">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Your most recent meal purchases</CardDescription>
                        </div>
                        <Link href="/user-dashboard/my-orders">
                            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/5">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-muted/40 hover:bg-muted/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <ShoppingBag className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Order #{order.id.slice(-6).toUpperCase()}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(order.createdAt), 'PPP')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <div className="font-bold text-sm">${order.totalAmount.toFixed(2)}</div>
                                                <div className="text-[10px] text-muted-foreground">{order.orderItems?.length || 0} items</div>
                                            </div>
                                            <Badge variant="outline" className={cn(
                                                "capitalize",
                                                order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-200" :
                                                    order.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" :
                                                        "bg-orange-50 text-orange-700 border-orange-200"
                                            )}>
                                                {order.status.toLowerCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingBag className="h-12 w-12 text-muted/30 mb-4" />
                                <h3 className="font-semibold">No orders yet</h3>
                                <p className="text-sm text-muted-foreground max-w-[250px] mt-2 mb-6">
                                    You haven't placed any orders yet. Ready for a delicious meal?
                                </p>
                                <Link href="/meals">
                                    <Button size="sm">Start Exploring</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Profile Summary Card */}
                <Card className="shadow-sm border-muted/60 h-fit">
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                        <CardDescription>Personal details and contact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="flex flex-col items-center pb-6 border-b border-muted">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-4 ring-primary/5">
                                {user?.image ? (
                                    <img src={user.image} alt={user.name!} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <UserIcon className="h-10 w-10 text-primary" />
                                )}
                            </div>
                            <h3 className="font-bold text-lg">{user?.name}</h3>
                            <Badge variant="secondary" className="mt-1 font-medium bg-primary/10 text-primary hover:bg-primary/10">
                                {(session?.user as any)?.role || "USER"}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">{(user as any)?.phone || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Address</p>
                                    <p className="text-sm font-medium line-clamp-2">{(user as any)?.address || "No address saved"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link href="/user-dashboard/profile">
                                <Button variant="outline" className="w-full">Edit Profile</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
