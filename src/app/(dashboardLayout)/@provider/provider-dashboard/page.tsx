"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from "@/components/ui/button";
import { providersAPI, mealsAPI, ordersAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Utensils, ClipboardList, TrendingUp, Store } from "lucide-react";
import ImageUpload from "@/components/common/ImageUpload";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const DEFAULT_LOGO = "/restaurantlogo.png";

export default function ProviderDashboardPage() {
    const { data: session } = authClient.useSession();
    const [provider, setProvider] = useState<any>(null);
    const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
    const [isUpdating, setIsUpdating] = useState(false);
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
                        setLogo(providerData.logo || DEFAULT_LOGO);
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

    const handleUpdateLogo = async () => {
        if (!provider?.id) return;
        setIsUpdating(true);
        try {
            await providersAPI.update(provider.id, { logo: logo });
            toast.success("Logo updated successfully");
        } catch (error: any) {
            console.error("Error updating logo:", error);
            toast.error(error.message || "Error updating logo");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
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
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
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

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="shadow-lg pt-0  border-primary/10">
                    <CardHeader className="bg-primary/5 pt-4 pb-6">
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-primary" />
                            <CardTitle>Restaurant Logo</CardTitle>
                        </div>
                        <CardDescription>
                            Upload your restaurant's logo to represent your brand.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <ImageUpload
                            onUploadComplete={(url) => setLogo(url)}
                            defaultValue={logo}
                            label="Logo Image"
                        />

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                onClick={handleUpdateLogo}
                                disabled={isUpdating || !logo}
                                className="w-full md:w-auto px-8"
                            >
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Logo
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                        <CardDescription>
                            Your registered business details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-3 py-3 border-b border-muted">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <span className="col-span-2 text-sm">{provider?.email}</span>
                        </div>
                        <div className="grid grid-cols-3 py-3 border-b border-muted">
                            <span className="text-sm font-medium text-muted-foreground">Phone</span>
                            <span className="col-span-2 text-sm">{provider?.phone || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-3 py-3 border-b border-muted">
                            <span className="text-sm font-medium text-muted-foreground">Address</span>
                            <span className="col-span-2 text-sm">{provider?.address || "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-3 py-3">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <span className="col-span-2">
                                <Badge variant={provider?.isActive ? "outline" : "destructive"} className={provider?.isActive ? "bg-green-100 text-green-700 border-green-200" : ""}>
                                    {provider?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>

                        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                            Note: To change your business details, please contact the administrator.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
