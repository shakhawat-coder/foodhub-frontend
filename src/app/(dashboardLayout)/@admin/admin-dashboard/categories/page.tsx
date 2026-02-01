import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
// import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { CategoryStatusToggle } from '@/components/modules/admin/category-status-toggle'
import { SquarePen } from 'lucide-react';
import { DeleteCategoryButton } from '@/components/modules/admin/delete-category-button'
import Link from 'next/link'
import { categoriesAPI } from '@/lib/api'

interface Category {
    id: string;
    name: string;
    image: string;
    isActive: boolean;
    meals: any[];
}

export default async function AllCategories() {
    let categories: Category[] = [];

    try {
        const data = await categoriesAPI.getAll();
        categories = data as Category[];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage your food categories and their visibility.
                    </p>
                </div>
                <Link
                    href="/admin-dashboard/add-category"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Add Category
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-25">Image</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Meals</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                            <img
                                                src={category.image || '/placeholder.png'}
                                                alt={category.name}
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        <CategoryStatusToggle
                                            categoryId={category.id}
                                            initialStatus={category.isActive}
                                        />
                                    </TableCell>
                                    <TableCell>{category.meals?.length || 0} Meals</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin-dashboard/categories/edit/${category.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                            </Link>
                                            <DeleteCategoryButton
                                                categoryId={category.id}
                                                categoryName={category.name}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
