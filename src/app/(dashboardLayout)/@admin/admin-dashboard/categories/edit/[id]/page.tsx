import React from 'react'
import { EditCategoryForm } from '@/components/modules/admin/edit-category-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let category = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            category = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch category:", error);
    }

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/admin-dashboard/categories"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <MoveLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-sm text-muted-foreground">Back to Categories</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
                    <p className="text-muted-foreground">
                        Update the details for the "{category.name}" category.
                    </p>
                </div>
            </div>

            <EditCategoryForm category={category} />
        </div>
    )
}
