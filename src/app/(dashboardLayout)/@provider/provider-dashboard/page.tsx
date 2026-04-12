"use client";
import DashboardLoading from "@/components/common/DashboardLoading";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { providersAPI, mealsAPI, ordersAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Utensils, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { DashboardAnalyticsSection } from "@/components/modules/dashboard/analytics-section";

export default function ProviderDashboardPage() {
    const { data: session } = authClient.useSession();
    const [provider, setProvider] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMeals: 0,
        incomingOrders: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.email) {
                try {
                    setIsLoading(true);
                    const email = session.user.email;

                    const providerData: any = await providersAPI.getByEmail(email);
                    if (providerData) {
                        setProvider(providerData);
                    }

                    const [meals, incomingOrders] = await Promise.all([
                        mealsAPI.getAll({ params: { providerEmail: email } }).catch(() => []),
                        ordersAPI.getProviderOrders({ type: "incoming" }).catch(() => [])
                    ]);

                    setStats({
                        totalMeals: Array.isArray(meals) ? meals.length : 0,
                        incomingOrders: Array.isArray(incomingOrders) ? incomingOrders.length : 0,
                    });
                } catch (err) {
                    console.error("Failed to fetch dashboard data", err);
                    toast.error("Failed to load dashboard data");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [session]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    const statCards = [
        {
            title: "Total Meals",
            value: stats.totalMeals,
            icon: Utensils,
            description: "Items in your menu",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Incoming Orders",
            value: stats.incomingOrders,
            icon: ClipboardList,
            description: "Orders to be processed",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
    ];

    return (
        <div className="space-y-8 p-4 md:p-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Provider Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, <span className="font-semibold text-foreground">{provider?.name || session?.user?.name}</span>.
                    Manage your restaurant and track performance.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border shadow-sm overflow-hidden">
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

            <DashboardAnalyticsSection mode="provider" />
        </div>
    );
}
