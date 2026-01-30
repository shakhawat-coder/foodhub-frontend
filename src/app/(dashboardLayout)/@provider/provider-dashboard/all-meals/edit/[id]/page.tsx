import React from 'react'
import { EditMealForm } from '@/components/modules/provider/edit-meal-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditMealPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    let meal = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            meal = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch meal:", error);
    }

    if (!meal) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/provider-dashboard/all-meals"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <MoveLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-sm text-muted-foreground">Back to Menu</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Meal</h1>
                    <p className="text-muted-foreground">
                        Update your meal information and visibility.
                    </p>
                </div>
            </div>

            <EditMealForm meal={meal} />
        </div>
    )
}
