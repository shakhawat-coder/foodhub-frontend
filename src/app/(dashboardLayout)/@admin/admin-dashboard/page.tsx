import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users, ShoppingBag, Utensils, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { headers } from "next/headers";

import { categoriesAPI, usersAPI, ordersAPI, mealsAPI } from '@/lib/api'

async function getStats() {
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';

    const options = {
        headers: { Cookie: cookie }
    };

    try {
        const [categories, usersResponse, orders, meals] = await Promise.all([
            categoriesAPI.getAll().catch(() => []),
            usersAPI.getAll(options).catch(() => ({ data: [] })),
            ordersAPI.getAll(options).catch(() => []),
            mealsAPI.getAll().catch(() => [])
        ]) as any[];

        return {
            categories: Array.isArray(categories) ? categories.length : 0,
            users: Array.isArray(usersResponse.data) ? usersResponse.data.length : 0,
            orders: Array.isArray(orders) ? orders.length : 0,
            meals: Array.isArray(meals) ? meals.length : 0,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            categories: 0,
            users: 0,
            orders: 0,
            meals: 0,
        };
    }
}


export default async function AdminDashboardPage() {
    const stats = await getStats();

    const statCards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            href: "/admin-dashboard/users",
            description: "Manage registered users and roles",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Categories",
            value: stats.categories,
            icon: Layers,
            href: "/admin-dashboard/categories",
            description: "Manage meal categories",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100"
        },
        {
            title: "Total Meals",
            value: stats.meals,
            icon: Utensils,
            href: "/admin-dashboard/meals",
            description: "Overview of all menu items",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100"
        },
        {
            title: "Total Orders",
            value: stats.orders,
            icon: ShoppingBag,
            href: "/admin-dashboard/orders",
            description: "Manage all customer orders",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-100"
        },
    ];

    return (
        <div className="space-y-8 p-2">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Admin Overview
                </h1>
                <p className="text-muted-foreground mt-2">
                    Quick summary of your platform's performance and data.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.href}
                        className="group relative transition-all duration-300 hover:-translate-y-1"
                    >
                        <Card className={`overflow-hidden border ${stat.borderColor} shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2.5 rounded-xl ${stat.bgColor} transition-colors group-hover:bg-primary/10`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:text-primary transition-colors`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline space-x-2">
                                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                                    {stat.description}
                                </p>
                                <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
