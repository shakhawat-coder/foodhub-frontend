"use client"

import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SquarePen, Star, Loader2 } from 'lucide-react';
import Link from 'next/link'
import { DeleteMealButton } from '@/components/modules/provider/delete-meal-button';
import { authClient } from "@/lib/auth-client";
import { mealsAPI } from '@/lib/api';


interface Meal {
    id: string;
    name: string;
    image: string | null;
    price: number;
    dietaryTypes: string;
    isPopular: boolean;
    providerId: string;
    category: {
        name: string;
    };
}

export default function AllMeals() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = authClient.useSession();
    // console.log(session);


    useEffect(() => {
        const fetchMeals = async () => {
            if (!session?.user) return;

            try {
                const email = session.user.email;
                if (!email) {
                    console.error("No user email found in session.");
                    setIsLoading(false);
                    return;
                }

                const data: any = await mealsAPI.getAll({
                    params: { providerEmail: email }
                });
                setMeals(data);
            } catch (error) {
                console.error("Failed to fetch meals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchMeals();
        }
    }, [session]);

    if (isLoading) {
        return (
            <div className="flex h-100 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Meals</h1>
                    <p className="text-muted-foreground">
                        Manage your menu items and their availability.
                    </p>
                </div>
                <Link
                    href="/provider-dashboard/add-meal"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Add Meal
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Meal Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Dietary Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.length > 0 ? (
                            meals.map((meal) => (
                                <TableRow key={meal.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                            <img
                                                src={meal.image || '/placeholder.png'}
                                                alt={meal.name}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {meal.name}
                                            {meal.isPopular && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>${meal.price.toFixed(2)}</TableCell>
                                    <TableCell>{meal.category?.name || 'Uncategorized'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{meal.dietaryTypes}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={meal.isPopular ? "default" : "secondary"}>
                                            {meal.isPopular ? "Popular" : "Standard"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/provider-dashboard/all-meals/edit/${meal.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                            </Link>
                                            <DeleteMealButton
                                                mealId={meal.id}
                                                mealName={meal.name}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No meals found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
