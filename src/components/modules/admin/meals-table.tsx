"use client"

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SquarePen, Star, Search, Filter } from 'lucide-react';
import Link from 'next/link'
import { DeleteMealButton } from '@/components/modules/provider/delete-meal-button';
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Meal {
    id: string;
    name: string;
    image: string | null;
    price: number;
    dietaryTypes: string;
    isPopular: boolean;
    providerId: string;
    provider?: {
        name: string;
        email: string;
    };
    category: {
        name: string;
    };
}

interface MealsTableProps {
    meals: Meal[];
}

export function AdminMealsTable({ meals: initialMeals }: MealsTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredMeals = initialMeals.filter(meal => {
        const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.provider?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? meal.category?.name === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(initialMeals.map(m => m.category?.name).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Meal Management</h1>
                    <p className="text-muted-foreground">
                        Overview of all meals offered across the platform.
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search meals, categories, or providers..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={selectedCategory === null}
                                onCheckedChange={() => setSelectedCategory(null)}
                            >
                                All Categories
                            </DropdownMenuCheckboxItem>
                            {categories.map((cat) => (
                                <DropdownMenuCheckboxItem
                                    key={cat}
                                    checked={selectedCategory === cat}
                                    onCheckedChange={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Meal Name</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Dietary</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMeals.length > 0 ? (
                            filteredMeals.map((meal) => (
                                <TableRow key={meal.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                                            <img
                                                src={meal.image || '/placeholder.png'}
                                                alt={meal.name}
                                                className="object-cover h-full w-full"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder.png'
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {meal.name}
                                            {meal.isPopular && (
                                                <div className="flex items-center justify-center p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{meal.provider?.name || 'N/A'}</span>
                                            <span className="text-xs text-muted-foreground">{meal.provider?.email || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-medium">
                                            {meal.category?.name || 'Uncategorized'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-primary">
                                        ${meal.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                                            {meal.dietaryTypes}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={meal.isPopular ? "default" : "secondary"} className="rounded-full">
                                            {meal.isPopular ? "Popular" : "Standard"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Note: In a real app, editing a provider's meal might have restrictions */}
                                            <Link
                                                href={`/admin-dashboard/meals/edit/${meal.id}`}
                                                className="p-2 rounded-md border hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                                                title="Edit Meal"
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
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <p className="font-medium">No meals found</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
