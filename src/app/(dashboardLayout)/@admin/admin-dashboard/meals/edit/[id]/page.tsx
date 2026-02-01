import React from 'react'
import { EditMealForm } from '@/components/modules/provider/edit-meal-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mealsAPI } from '@/lib/api'


export default async function AdminEditMealPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let meal: any = null;
    try {
        meal = await mealsAPI.getById(id);
    } catch (error) {
        console.error("Failed to fetch meal for admin edit:", error);
    }

    if (!meal) {
        notFound();
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/admin-dashboard/meals"
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm"
                        >
                            <MoveLeft className="h-4 w-4" />
                            Back to Meals
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Meal (Admin)</h1>
                    <p className="text-muted-foreground">
                        Modify meal details as an administrator.
                    </p>
                </div>
            </div>

            <EditMealForm meal={meal} />
        </div>
    )
}
